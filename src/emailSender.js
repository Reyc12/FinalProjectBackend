const nodemailer = require('nodemailer');

module.exports = {

    main : async function main(obj) {
        let transporter = nodemailer.createTransport({
            host: "mail.bspoketech.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: 'test@bspoketech.com', // generated ethereal user
                pass: 'D-Z6xF+xoVMW', // generated ethereal password
            },
        });

        const customerName = `${obj.customer_name}`,
        resDate = `${obj.reservation_date}`,
            resTime = `${obj.reservation_time}`,
            resId = `${obj.reservation_id}`,
        guestNumber = `${obj.reservation_guestnumber}`;


        const confirmation = `
        Hello ${customerName},
        I would like to confirm your reservation with us on ${resDate}, for a table of ${guestNumber}, at ${resTime}.
        Your reservation id is : ${resId}`


        const resName = `${obj.restaurant_name}`;
        const customerEmail = `${obj.reservation_guestEmail}`
// send mail with defined transport object
        let info = await transporter.sendMail({
            from: `${resName} <test@bspoketech.com>`, // sender address
            to: `${customerEmail}`, // list of receivers
            subject: "Reservation", // Subject line
            text: `${confirmation}`, // plain text body
            //html: "<b>Hello world?</b>", // html body
        });

        const restaurantConfirmation = `Hello ${obj.restaurant_name},
         You have a new reservation from ${customerName} on ${resDate} for a table of ${guestNumber}, at ${resTime}.
         Reservation id is ${resId}`;

        let restaurantInfo = await transporter.sendMail({
            from: `FindMyTable <test@bspoketech.com>`, // sender address
            to: `reycelo14@gmail.com`, // list of receivers
            subject: "Reservation", // Subject line
            text: `${restaurantConfirmation}`, // plain text body
            //html: "<b>Hello world?</b>", // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    }





}
