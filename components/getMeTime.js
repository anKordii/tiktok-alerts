const getMeTime = function (cost) {
    if(cost >= 5000000){
        return 4000;
    }

    return 3000;
};
export default getMeTime;
  