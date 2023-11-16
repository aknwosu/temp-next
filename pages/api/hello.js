import formidable from 'formidable';
import csv from 'csv-parser';
import fs from 'fs';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const form = formidable({});

        form.parse(req, (err, fields, files) => {
            if (err) {
                next(err);
                return;
            }
            console.log("==fields===", fields);
            console.log("==files===", files);
            const filePath = files.file[0].filepath;

            const results = [];

            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data) => {
                    // 'data' represents a row in the CSV file
                    // Access cell values using data.columnName
                    results.push(data);
                    console.log("==results===", data)

                })
                .on('end', () => {

                    console.log("==end===", results)
                    // TODO: Do something with the parsed data (results array)
                    // e.g., send the data to the frontend or perform further processing

                    res.status(200).json({ message: 'File uploaded and processed successfully' });
                });

            // res.json({ fields, files });
        });

    } else if (req.method === 'GET') {
        res.status(200).json({ message: 'Hello GEETTT Next.js!' })

    }
}