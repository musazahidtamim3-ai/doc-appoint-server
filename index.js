require('dotenv').config();
const express = require('express')
const app = express()
const cors = require('cors')

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { createRemoteJWKSet, jwtVerify } = require('jose-cjs');

const PORT = process.env.PORT || 5000;
const uri = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
     serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
     }
});

const JWKS = createRemoteJWKSet(
     new URL("http://localhost:3000/api/auth/jwks")
)

const verifyToken = async (req, res, next) => {
     const authHeader = req?.headers.authorization;
     if (!authHeader) {
          return res.status(401).json({ message: "Unauthorized" })
     }
     const token = authHeader.split(" ")[1];
     if (!token) {
          return res.status(401).json({ message: "Unauthorized" })
     }
     try {
          const { payload } = await jwtVerify(token, JWKS);
          console.log("Token Verified Payload:", payload);
          req.user = payload; 
     }
     catch (error) {
          console.error("JWT Verification Error:", error.message);
          return res.status(403).json({ message: "Forbidden", error: error.message });
     }
}

async function run() {
     try {
          await client.connect();

          const db = client.db('doc-appoint')
          const doctorsCollection = db.collection('doctors')
          const bookingCollection = db.collection('bookings')

          const count = await doctorsCollection.countDocuments();
          if (count === 0) {
               const doctorsData = [
                    {
                         "id": "d1",
                         "name": "Dr. Ayesha Rahman",
                         "specialty": "Cardiologist",
                         "image": "https://images.unsplash.com/photo-1741868159744-159b83484687",
                         "education": "MBBS, MD-Cardiology",
                         "experience": "10 years",
                         "availability": [
                              "09:00 AM - 12:00 PM",
                              "04:00 PM - 07:00 PM"
                         ],
                         "description": "Highly experienced cardiologist specializing in heart diseases, preventive care, and patient-centered treatment.",
                         "hospital": "Labaid Cardiac Hospital",
                         "location": "Dhanmondi, Dhaka",
                         "fee": 800,
                         "rating": 4.8,
                         "totalReviews": 124,
                         "about": "Dr. Ayesha Rahman is a dedicated Cardiologist with a decade of experience in non-invasive cardiology. She focuses heavily on preventive cardiology, hypertension management, and lifestyle modifications to prevent chronic heart failure.",
                         "specialties": [
                              "Echocardiography",
                              "Hypertension Management",
                              "Ischemic Heart Disease",
                              "Heart Failure Care"
                         ],
                         "experienceHistory": [
                              {
                                   "role": "Senior Consultant",
                                   "institution": "Labaid Cardiac Hospital",
                                   "period": "2020 - Present"
                              },
                              {
                                   "role": "Assistant Professor",
                                   "institution": "National Heart Foundation",
                                   "period": "2016 - 2020"
                              }
                         ]
                    },
                    {
                         "id": "d2",
                         "name": "Prof. Dr. M. A. Bashar",
                         "specialty": "Neurologist",
                         "image": "https://images.unsplash.com/photo-1712215544003-af10130f8eb3",
                         "education": "MBBS, MD-Neurology",
                         "experience": "15 years",
                         "availability": [
                              "10:00 AM - 01:00 PM",
                              "06:00 PM - 09:00 PM"
                         ],
                         "description": "Expert in treating complex neurological disorders, stroke management, and chronic migraines.",
                         "hospital": "National Institute of Neurosciences & Hospital",
                         "location": "Agargaon, Dhaka",
                         "fee": 1000,
                         "rating": 4.9,
                         "totalReviews": 210,
                         "about": "Prof. Dr. M. A. Bashar is a renowned Neurologist recognized for his critical research in acute stroke management. Over his 15-year career, he has successfully treated thousands of patients suffering from complex brain and nerve-related conditions.",
                         "specialties": [
                              "Acute Stroke Intervention",
                              "Chronic Migraine Therapy",
                              "Epilepsy Management",
                              "Neuropathy"
                         ],
                         "experienceHistory": [
                              {
                                   "role": "Professor & Head of Dept",
                                   "institution": "National Institute of Neurosciences",
                                   "period": "2019 - Present"
                              },
                              {
                                   "role": "Associate Professor",
                                   "institution": "Dhaka Medical College Hospital",
                                   "period": "2014 - 2019"
                              }
                         ]
                    }
               ];
               const result = await doctorsCollection.insertMany(doctorsData);
               console.log(`${result.insertedCount} document auto imported!`);
          }

          app.get('/', (req, res) => {
               res.send('Doc Appoint Server is Running...');
          })

          app.get('/doctors', async (req, res) => {
               const doctors = await doctorsCollection.find().toArray()
               res.send(doctors);
          })

          app.get('/doctors/:id', verifyToken, async (req, res) => {
               const { id } = req.params;
               const result = await doctorsCollection.findOne({ id: id })
               res.send(result);
          })

          app.post('/bookings', verifyToken, async (req, res) => {
               const booking = req.body;
               const result = await bookingCollection.insertOne(booking)
               res.send(result);
          })

          app.get('/bookings', async (req, res) => {
               const result = await bookingCollection.find().toArray()
               res.send(result);
          })

          app.delete('/bookings/:id', async (req, res) => {
               const { id } = req.params
               const result = await bookingCollection.deleteOne({ _id: new ObjectId(id) })
               res.send(result);
          })

          app.patch('/bookings/:id', async (req, res) => {
               const { id } = req.params;
               const updatedData = req.body;
               const result = await bookingCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updatedData }
               );
               res.send(result);
          })

          await client.db("admin").command({ ping: 1 });
          console.log("Pinged your deployment. You successfully connected to MongoDB!");
     } catch (err) {
          console.error("MongoDB core connection error:", err);
     }
}
run().catch(console.dir);

app.listen(PORT, () => {
     console.log(`Doc Appoint Server is listening on port ${PORT}`);
});