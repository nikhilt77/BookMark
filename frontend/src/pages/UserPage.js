import React, { useState, useEffect } from "react";
import { useAuth } from "../utils/auth";
import { fetchUserProfile } from "../utils/api";
import "../styles/UserPage.css";

const UserPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("profile"); // Add tabs for different sections
  const { authUser } = useAuth();

  useEffect(() => {
    const getUserProfile = async () => {
      if (authUser) {
        try {
          const profile = await fetchUserProfile(authUser.token);
          setUser(profile);
        } catch (error) {
          console.error("Error fetching user profile", error);
          setError(error.message || "Error fetching user profile");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setError("You must be logged in to view your profile");
      }
    };
    getUserProfile();
  }, [authUser]);

  if (loading) {
    return <div className="profile-loading">Loading Profile...</div>;
  }

  if (error) {
    return <div className="profile-error">{error}</div>;
  }

  if (!user) {
    return <div className="profile-not-found">No user data available</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {user.username ? user.username[0].toUpperCase() : "U"}
        </div>
        <h1>{user.username}</h1>
        <p className="profile-email">{user.email}</p>
      </div>

      <div className="profile-nav">
        <button
          className={`nav-button ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          Profile Info
        </button>
        <button
          className={`nav-button ${activeTab === "activity" ? "active" : ""}`}
          onClick={() => setActiveTab("activity")}
        >
          Activity
        </button>
        <button
          className={`nav-button ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          Settings
        </button>
      </div>

      <div className="profile-content">
        {activeTab === "profile" && (
          <div className="profile-info">
            <div className="info-card">
              <h3>Personal Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Username</span>
                  <span className="info-value">{user.username}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email</span>
                  <span className="info-value">{user.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">First Name</span>
                  <span className="info-value">
                    {user.firstName || "Not set"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Last Name</span>
                  <span className="info-value">
                    {user.lastName || "Not set"}
                  </span>
                </div>
              </div>
            </div>

            <div className="stats-card">
              <h3>Profile Statistics</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-value">0</span>
                  <span className="stat-label">Reviews</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">0</span>
                  <span className="stat-label">Books Read</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">0</span>
                  <span className="stat-label">Reading List</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="activity-feed">
            <h3>Recent Activity</h3>
            <p className="no-activity">No recent activity to show</p>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="settings-panel">
            <h3>Account Settings</h3>
            <div className="settings-options">
              <button className="settings-button">Edit Profile</button>
              <button className="settings-button">Change Password</button>
              <button className="settings-button danger">Delete Account</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPage;
