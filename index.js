require('dotenv').config();
const express = require('express')
const app = express()
const cors = require('cors')
const port = 5000

const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
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
const verifyToken = (req, res, next) => {
     const authHeader = req?.headers.authorization;
     const token = authHeader.split(" ")[1]
     console.log(token)

     next()
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
                    },
                    {
                         "id": "d3",
                         "name": "Dr. Nusrat Jahan",
                         "specialty": "Gynecologist",
                         "image": "https://images.unsplash.com/photo-1628258473666-9d3149c1da55",
                         "education": "MBBS, MS-OBGYN",
                         "experience": "8 years",
                         "availability": [
                              "11:00 AM - 03:00 PM",
                              "05:00 PM - 08:00 PM"
                         ],
                         "description": "Specialized in high-risk pregnancies, maternal-fetal medicine, and general reproductive health.",
                         "hospital": "Square Hospital",
                         "location": "Panthapath, Dhaka",
                         "fee": 900,
                         "rating": 4.6,
                         "totalReviews": 95,
                         "about": "Dr. Nusrat Jahan is a compassionate Gynecologist specializing in high-risk pregnancies and modern laparoscopic surgeries. She is an advocate for maternal health education and painless normal delivery counseling.",
                         "specialties": [
                              "High-Risk Pregnancy",
                              "Laparoscopic Gynae Surgery",
                              "Infertility Evaluation",
                              "PCOS Management"
                         ],
                         "experienceHistory": [
                              {
                                   "role": "Consultant Gynaecologist",
                                   "institution": "Square Hospital",
                                   "period": "2021 - Present"
                              },
                              {
                                   "role": "Registrar",
                                   "institution": "Sir Salimullah Medical College",
                                   "period": "2018 - 2021"
                              }
                         ]
                    },
                    {
                         "id": "d4",
                         "name": "Dr. Tanvir Ahmed",
                         "specialty": "Pediatrician",
                         "image": "https://images.unsplash.com/photo-1582750433449-648ed127bb54",
                         "education": "MBBS, MD-Pediatrics",
                         "experience": "12 years",
                         "availability": [
                              "09:30 AM - 12:30 PM",
                              "04:30 PM - 07:30 PM"
                         ],
                         "description": "Dedicated child specialist focusing on newborn care, childhood immunizations, and pediatric nutrition.",
                         "hospital": "Evercare Hospital",
                         "location": "Bashundhara R/A, Dhaka",
                         "fee": 1200,
                         "rating": 4.7,
                         "totalReviews": 150,
                         "about": "Dr. Tanvir Ahmed is a highly sought-after Pediatrician known for his patient and friendly approach with children. He specializes in neonatal intensive care (NICU), childhood developmental delays, and nutrition profiling.",
                         "specialties": [
                              "Neonatal Critical Care",
                              "Pediatric Nutrition",
                              "Asthma & Allergy Care",
                              "Child Growth Monitoring"
                         ],
                         "experienceHistory": [
                              {
                                   "role": "Senior Consultant",
                                   "institution": "Evercare Hospital",
                                   "period": "2018 - Present"
                              },
                              {
                                   "role": "Assistant Professor",
                                   "institution": "Bangladesh Child Health Physicians",
                                   "period": "2014 - 2018"
                              }
                         ]
                    },
                    {
                         "id": "d5",
                         "name": "Prof. Dr. Asif Iqbal",
                         "specialty": "Orthopedic Surgeon",
                         "image": "https://images.unsplash.com/photo-1637059824899-a441006a6875",
                         "education": "MBBS, MS-Orthopedics",
                         "experience": "18 years",
                         "availability": [
                              "03:00 PM - 06:00 PM",
                              "07:00 PM - 09:30 PM"
                         ],
                         "description": "Renowned surgeon specializing in joint replacements, sports injuries, and complex fracture management.",
                         "hospital": "Popular Diagnostic Center",
                         "location": "Dhanmondi, Dhaka",
                         "fee": 1000,
                         "rating": 4.9,
                         "totalReviews": 188,
                         "about": "Prof. Dr. Asif Iqbal is an expert Orthopedic Surgeon with 18+ years of expertise. He is highly proficient in advanced arthroscopic surgeries, total knee and hip replacements, and reconstructive trauma surgeries.",
                         "specialties": [
                              "Knee & Hip Replacement",
                              "Arthroscopy & Sports Medicine",
                              "Spine Decompression",
                              "Fracture Fixation"
                         ],
                         "experienceHistory": [
                              {
                                   "role": "Chief Orthopedic Surgeon",
                                   "institution": "Popular Diagnostic Center",
                                   "period": "2016 - Present"
                              },
                              {
                                   "role": "Associate Professor",
                                   "institution": "National Institute of Traumatology (NITOR)",
                                   "period": "2008 - 2016"
                              }
                         ]
                    },
                    {
                         "id": "d6",
                         "name": "Dr. Sabina Yasmin",
                         "specialty": "Dermatologist",
                         "image": "https://images.unsplash.com/photo-1753486986927-ff09dafb99a1",
                         "education": "MBBS, MD-Dermatology",
                         "experience": "7 years",
                         "availability": [
                              "10:00 AM - 01:00 PM",
                              "04:00 PM - 06:30 PM"
                         ],
                         "description": "Specialist in clinical dermatology, skin allergy treatments, and advanced cosmetic procedures.",
                         "hospital": "United Hospital",
                         "location": "Gulshan, Dhaka",
                         "fee": 1000,
                         "rating": 4.5,
                         "totalReviews": 84,
                         "about": "Dr. Sabina Yasmin specializes in both clinical and aesthetic dermatology. She treats chronic skin conditions like psoriasis and eczema while offering premium clinical laser treatments and anti-aging therapies.",
                         "specialties": [
                              "Laser Skin Resurfacing",
                              "Acne Scar Treatment",
                              "Psoriasis & Eczema Clinic",
                              "Chemical Peels"
                         ],
                         "experienceHistory": [
                              {
                                   "role": "Consultant Dermatologist",
                                   "institution": "United Hospital",
                                   "period": "2022 - Present"
                              },
                              {
                                   "role": "Resident Physician",
                                   "institution": "BSMMU",
                                   "period": "2019 - 2022"
                              }
                         ]
                    },
                    {
                         "id": "d7",
                         "name": "Dr. Mehdi Hasan",
                         "specialty": "Endocrinitologist",
                         "image": "https://images.unsplash.com/photo-1620928269189-dc4ee9d981c0",
                         "education": "MBBS, MD-Endocrinology",
                         "experience": "19 years",
                         "availability": [
                              "08:00 AM - 11:00 AM",
                              "05:00 PM - 08:00 PM"
                         ],
                         "description": "Expert in diabetes management, thyroid disorders, and metabolic hormonal imbalances.",
                         "hospital": "BIRDEM General Hospital",
                         "location": "Shahbagh, Dhaka",
                         "fee": 700,
                         "rating": 4.7,
                         "totalReviews": 112,
                         "about": "Dr. Mehdi Hasan is a senior Endocrinologist with nearly two decades of dedication at BIRDEM. He is deeply involved in managing critical diabetic complications, thyroid malignancies, and growth hormone deficiencies.",
                         "specialties": [
                              "Advanced Diabetes Care",
                              "Thyroid Disorder Management",
                              "Hormonal Imbalance",
                              "Obesity Management"
                         ],
                         "experienceHistory": [
                              {
                                   "role": "Senior Consultant",
                                   "institution": "BIRDEM General Hospital",
                                   "period": "2012 - Present"
                              },
                              {
                                   "role": "Assistant Professor",
                                   "institution": "Dhaka Medical College",
                                   "period": "2007 - 2012"
                              }
                         ]
                    },
                    {
                         "id": "d8",
                         "name": "Dr. Farhana Khan",
                         "specialty": "Ophthalmologist",
                         "image": "https://images.unsplash.com/photo-1676653002396-8e5aa96a3fcc",
                         "education": "MBBS, MS-Ophthalmology",
                         "experience": "11 years",
                         "availability": [
                              "09:00 AM - 01:00 PM"
                         ],
                         "description": "Specialized in cataract surgery, glaucoma treatment, and comprehensive vision care.",
                         "hospital": "Bangladesh Eye Hospital",
                         "location": "Zigatola, Dhaka",
                         "fee": 800,
                         "rating": 4.6,
                         "totalReviews": 73,
                         "about": "Dr. Farhana Khan is an expert Eye Specialist with vast experience in phacoemulsification (cataract surgery). She is committed to fighting preventable blindness through advanced glaucoma screenings and diabetic retinopathy treatments.",
                         "specialties": [
                              "Phaco Cataract Surgery",
                              "Glaucoma Management",
                              "Refractive Error Correction",
                              "Lasik Consultation"
                         ],
                         "experienceHistory": [
                              {
                                   "role": "Senior Phaco Surgeon",
                                   "institution": "Bangladesh Eye Hospital",
                                   "period": "2019 - Present"
                              },
                              {
                                   "role": "Consultant",
                                   "institution": "National Institute of Ophthalmology",
                                   "period": "2015 - 2019"
                              }
                         ]
                    },
                    {
                         "id": "d9",
                         "name": "Dr. Kamrul Islam",
                         "specialty": "Urologist",
                         "image": "https://images.unsplash.com/photo-1603843722974-3a4031f9f97c",
                         "education": "MBBS, MS-Urology",
                         "experience": "14 years",
                         "availability": [
                              "04:00 PM - 08:00 PM"
                         ],
                         "description": "Expert in kidney stone removal, prostate health, and advanced urological surgeries.",
                         "hospital": "Center for Kidney Diseases & Urology",
                         "location": "Shyamoli, Dhaka",
                         "fee": 900,
                         "rating": 4.8,
                         "totalReviews": 142,
                         "about": "Dr. Kamrul Islam is a highly accomplished Urologist specializing in minimally invasive endourology. He has comprehensive skills in handling laser kidney stone extractions (PNL, RIRS) and advanced prostate treatments (TURP).",
                         "specialties": [
                              "Laser Kidney Stone Surgery",
                              "Prostate Enlargement (TURP)",
                              "Uro-Oncology",
                              "Male Infertility"
                         ],
                         "experienceHistory": [
                              {
                                   "role": "Chief Consultant Urologist",
                                   "institution": "Center for Kidney Diseases",
                                   "period": "2017 - Present"
                              },
                              {
                                   "role": "Associate Professor",
                                   "institution": "National Institute of Kidney Diseases",
                                   "period": "2012 - 2017"
                              }
                         ]
                    },
                    {
                         "id": "d10",
                         "name": "Dr. Saima Anwar",
                         "specialty": "Psychiatrist",
                         "image": "https://images.unsplash.com/photo-1757125736482-328a3cdd9743",
                         "education": "MBBS, MD-Psychiatry",
                         "experience": "6 years",
                         "availability": [
                              "02:00 PM - 05:00 PM",
                              "06:30 PM - 09:00 PM"
                         ],
                         "description": "Compassionate mental health professional specializing in anxiety, depression, and stress management.",
                         "hospital": "Anwer Khan Modern Medical College",
                         "location": "Dhanmondi, Dhaka",
                         "fee": 800,
                         "rating": 4.4,
                         "totalReviews": 56,
                         "about": "Dr. Saima Anwar provides empathetic, modern psychiatric care. She focuses on cognitive behavioral therapy (CBT) integrated with clinical medicine to treat mood disorders, panic attacks, and severe corporate burnout.",
                         "specialties": [
                              "Anxiety & Panic Disorders",
                              "Clinical Depression Therapy",
                              "Cognitive Behavioral Therapy",
                              "Sleep Disorders"
                         ],
                         "experienceHistory": [
                              {
                                   "role": "Assistant Professor",
                                   "institution": "Anwer Khan Modern Medical College",
                                   "period": "2023 - Present"
                              },
                              {
                                   "role": "Consultant Psychiatrist",
                                   "institution": "National Institute of Mental Health",
                                   "period": "2020 - 2023"
                              }
                         ]
                    },
                    {
                         "id": "d11",
                         "name": "Dr. Rashedul Haque",
                         "specialty": "ENT Specialist",
                         "image": "https://images.unsplash.com/photo-1647763283644-578114aba0c2",
                         "education": "MBBS, MS-ENT",
                         "experience": "13 years",
                         "availability": [
                              "10:30 AM - 01:30 PM",
                              "05:30 PM - 08:30 PM"
                         ],
                         "description": "Specialized in ear, nose, and throat disorders, sinus surgeries, and hearing assessment.",
                         "hospital": "Green Life Medical College Hospital",
                         "location": "Green Road, Dhaka",
                         "fee": 700,
                         "rating": 4.5,
                         "totalReviews": 68,
                         "about": "Dr. Rashedul Haque is an expert ENT Surgeon with a key specialization in functional endoscopic sinus surgery (FESS) and microsurgeries of the ear. He is highly proficient in managing pediatric tonsil and adenoid removals safely.",
                         "specialties": [
                              "Endoscopic Sinus Surgery",
                              "Tonsillectomy & Adenoidectomy",
                              "Hearing Loss Assessment",
                              "Tinnitus Therapy"
                         ],
                         "experienceHistory": [
                              {
                                   "role": "Senior Consultant",
                                   "institution": "Green Life Medical College Hospital",
                                   "period": "2016 - Present"
                              },
                              {
                                   "role": "Assistant Professor",
                                   "institution": "Holy Family Red Crescent Hospital",
                                   "period": "2013 - 2016"
                              }
                         ]
                    },
                    {
                         "id": "d12",
                         "name": "Dr. Ariful Islam",
                         "specialty": "Gastroenterologist",
                         "image": "https://images.unsplash.com/photo-1580281658626-ee379f3cce93",
                         "education": "MBBS, MD-Gastroenterology",
                         "experience": "10 years",
                         "availability": [
                              "09:00 AM - 12:00 PM",
                              "04:00 PM - 07:00 PM"
                         ],
                         "description": "Specialist in liver diseases, gastric issues, and therapeutic endoscopy/colonoscopy.",
                         "hospital": "Ibn Sina Specialized Hospital",
                         "location": "Dhanmondi, Dhaka",
                         "fee": 800,
                         "rating": 4.7,
                         "totalReviews": 105,
                         "about": "Dr. Ariful Islam is an expert in interventional gastroenterology. He handles complex gastrointestinal emergencies and specializes in screening endoscopies, therapeutic colonoscopies, and chronic liver disease managements.",
                         "specialties": [
                              "Therapeutic Endoscopy",
                              "Colonoscopy & Polypectomy",
                              "IBD Management",
                              "Fatty Liver Disease Care"
                         ],
                         "experienceHistory": [
                              {
                                   "role": "Senior Consultant",
                                   "institution": "Ibn Sina Specialized Hospital",
                                   "period": "2021 - Present"
                              },
                              {
                                   "role": "Assistant Professor",
                                   "institution": "Dhaka Medical College Hospital",
                                   "period": "2016 - 2021"
                              }
                         ]
                    }
               ]
               const result = await doctorsCollection.insertMany(doctorsData);
               console.log(`${result.insertedCount} document auto imported!`);
          }

          app.get('/', (req, res) => {
               res.send('Doc Appoint Server is Running Running Running...');
          })
          app.get('/doctors', async(req, res) => {
               const doctors = await doctorsCollection.find().toArray()
               res.send(doctors);
          })
          app.get('/doctors/:id', verifyToken, async (req, res) => {
               const { id } = req.params;
               const result = await doctorsCollection.findOne({ id: id })
               res.send(result);
          })
          app.post('/bookings', async (req, res) => {
               const booking = req.body;
               const result = await bookingCollection.insertOne(booking)
               res.send(result);
          })
          app.get('/bookings', async (req, res) => {
               const result = await bookingCollection.find().toArray()
               res.send(result);
          })
          app.delete('/bookings/:id', async (req, res) => {
               const {id} = req.params
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
app.listen(port, () => {
     console.log(`Doc Appoint Server is listening on port ${port}`);
});