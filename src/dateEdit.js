
module.exports = {


//TRANSFORMS DATE STRING INTO DATE OBJECT
   transform: function transformDate(obj){
        const a = obj.reservation_date;
        const b = a.split('/');
        obj.reservation_date = new Date(+b[2], b[1] - 1, +b[0]);
        return obj;
    },

    /*
    * arr -> the rows
    * d -> date(today's date)
    * upcoming -> if upcoming reservations are needed that its tru, if previous reservations are required than its false)
    * function compares the reservation date of each reservation with the today's date,
    * I have introduced the upcoming variable so that I can reuse the function for both upcoming reservation and previous reservations
    *  */
    sort: function getSorted(arr,d,upcoming){
        const b = d.split('/');
        const date = new Date(+b[2], b[1] - 1, +b[0]);
        return arr.filter(row => {
            let time = new Date(row.reservation_date).getTime();
            if(upcoming){
                return (time >= date);
            }
            return (time < date);
        });



    },





};
