const formatData = (data) => {
  try {
       return JSON.parse(JSON.stringify(data));
     }
    catch(error){
        console.error('Error formatting data', error);
        return data
    }
}
export {formatData}
