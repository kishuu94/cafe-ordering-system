const QRCode = require("qrcode");

for (let i = 1; i <= 7; i++) {

    const url =
    `https://cafe-ordering-system01.netlify.app/?table=${i}`;

    QRCode.toFile(
        `table-${i}.png`,
        url,
        (err) => {

            if (err) {
                console.error(err);
                return;
            }

            console.log(`Created QR for Table ${i}`);
        }
    );
}