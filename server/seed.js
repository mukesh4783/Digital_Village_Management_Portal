import 'dotenv/config';
import mongoose from 'mongoose';
import Citizen from './models/Citizen.js';
import Household from './models/Household.js';
import ServiceRequest from './models/ServiceRequest.js';
import {WelfareScheme, WelfareApplication} from './models/Welfare.js';
import Certificate from './models/Certificate.js';
import Notification from './models/Notification.js';

const MALE_NAMES = ['Rajesh', 'Suresh', 'Mahesh', 'Ramesh', 'Ganesh', 'Anil', 'Sunil', 'Vijay', 'Sanjay', 'Ajay', 'Ravi', 'Kiran', 'Mohan', 'Sohan', 'Rohan', 'Amit', 'Sumit', 'Vinod', 'Pramod', 'Manoj'];
const FEMALE_NAMES = ['Priya', 'Sunita', 'Anita', 'Kavita', 'Savita', 'Rekha', 'Meena', 'Seema', 'Geeta', 'Sita', 'Rita', 'Neeta', 'Pooja', 'Renu', 'Manju', 'Anju', 'Kamla', 'Sarla', 'Pushpa', 'Lata'];
const LAST_NAMES = ['Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Yadav', 'Patel', 'Mishra', 'Tiwari', 'Pandey', 'Dubey', 'Shukla', 'Srivastava', 'Joshi', 'Chauhan'];
const OCCUPATIONS = ['Farmer', 'Agricultural Labourer', 'Teacher', 'Shopkeeper', 'Carpenter', 'Mason', 'Electrician', 'Plumber', 'Tailor', 'Weaver'];
const STREETS = ['Main Road', 'Gandhi Nagar', 'Nehru Colony', 'Ambedkar Street', 'Patel Marg', 'Station Road', 'Temple Street', 'Market Lane'];
const CATS = ['General', 'OBC', 'SC', 'ST'];
const SVC_CATS = ['Water Supply', 'Road Repair', 'Sanitation', 'Electricity', 'Other'];
const VILLAGE = 'Sundarpur';

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rNum = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const rDate = (days) => new Date(Date.now() - rNum(0, days * 24 * 60 * 60 * 1000));

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  console.log('Clearing old data...');
  await Citizen.deleteMany({});
  await Household.deleteMany({});
  await ServiceRequest.deleteMany({});
  await WelfareScheme.deleteMany({});
  await WelfareApplication.deleteMany({});
  await Certificate.deleteMany({});
  await Notification.deleteMany({});

  console.log('Creating 30 Households...');
  const hhs = [];
  for(let i=0; i<30; i++) {
    const hh = await Household.create({
      houseNumber: `HH-${rNum(100,999)}`,
      headName: `${rand(MALE_NAMES)} ${rand(LAST_NAMES)}`,
      address: `${rand(STREETS)}, ${VILLAGE}`,
      members: rNum(2, 8),
      category: rand(['APL', 'BPL', 'AAY'])
    });
    hhs.push(hh);
  }

  console.log('Creating 100 Citizens...');
  const citizens = [];
  for(let i=0; i<100; i++) {
    const isMale = Math.random() > 0.5;
    const name = `${isMale ? rand(MALE_NAMES) : rand(FEMALE_NAMES)} ${rand(LAST_NAMES)}`;
    const dob = new Date(new Date().setFullYear(new Date().getFullYear() - rNum(5, 70)));
    const c = await Citizen.create({
      name,
      fatherName: `${rand(MALE_NAMES)} ${rand(LAST_NAMES)}`,
      gender: isMale ? 'Male' : 'Female',
      dob,
      phone: `98${rNum(10000000, 99999999)}`,
      address: `${rNum(1, 100)}, ${rand(STREETS)}, ${VILLAGE}`,
      aadhar_no: `${rNum(100000000000, 999999999999)}`,
      occupation: rand(OCCUPATIONS),
      caste_category: rand(CATS),
      education: rand(['Primary', 'Secondary', 'Graduate']),
      householdId: rand(hhs)._id
    });
    citizens.push(c);
  }

  console.log('Creating 8 Welfare Schemes...');
  const schemes = [];
  const sData = [
    {name: 'PM Awas Yojana', dept: 'Housing', ben: 120000, desc: 'Housing for rural poor.'},
    {name: 'MGNREGA', dept: 'Employment', ben: 26700, desc: '100 days of guaranteed wage employment.'},
    {name: 'PM-KISAN', dept: 'Agriculture', ben: 6000, desc: 'Income support to farmers.'},
    {name: 'Ayushman Bharat', dept: 'Health', ben: 500000, desc: 'Health insurance coverage.'},
    {name: 'Mid-Day Meal', dept: 'Education', ben: 0, desc: 'Free lunch in primary schools.'},
    {name: 'PM Ujjwala Yojana', dept: 'Energy', ben: 1600, desc: 'Free LPG connection to women.'},
    {name: 'PM Kaushal Vikas', dept: 'Skill', ben: 8000, desc: 'Short-term training for rural youth.'},
    {name: 'Digital Saksharta', dept: 'IT', ben: 0, desc: 'Digital literacy training.'}
  ];
  for(const sd of sData) {
    const sc = await WelfareScheme.create({
      name: sd.name, department: sd.dept, benefit_amount: sd.ben, description: sd.desc,
      eligibility: 'BPL families', benefit: sd.ben ? `₹${sd.ben}` : 'Free Services', status: 'active'
    });
    schemes.push(sc);
  }

  console.log('Creating 40 Service Requests...');
  for(let i=0; i<40; i++) {
    const c = rand(citizens);
    const cat = rand(SVC_CATS);
    const status = rand(['submitted', 'under_review', 'in_progress', 'completed', 'rejected']);
    await ServiceRequest.create({
      title: `Issue regarding ${cat.toLowerCase()}`,
      category: cat,
      description: `Need urgent resolution for this issue near ${rand(STREETS)}.`,
      priority: rand(['low', 'medium', 'high', 'urgent']),
      location: `${rand(STREETS)}, ${VILLAGE}`,
      status,
      assigned_to: status !== 'submitted' ? `${rand(MALE_NAMES)} Staff` : '',
      admin_notes: status === 'completed' ? 'Resolved successfully.' : '',
      user: null, // Since we don't have user IDs for random citizens easily matched
      createdAt: rDate(180),
      status_history: [{status, note: 'Initial status', changed_by: 'System', changed_at: new Date()}]
    });
  }

  console.log('Creating 25 Welfare Applications...');
  for(let i=0; i<25; i++) {
    const c = rand(citizens);
    const sc = rand(schemes);
    const status = rand(['applied', 'under_review', 'verified', 'approved', 'rejected', 'disbursed']);
    await WelfareApplication.create({
      scheme: sc._id,
      scheme_name: sc.name,
      citizen_name: c.name,
      reason: 'Need assistance due to financial instability.',
      status,
      remarks: status === 'disbursed' ? 'Amount transferred' : '',
      disbursed_amount: status === 'disbursed' ? sc.benefit_amount : 0,
      createdAt: rDate(150)
    });
  }

  console.log('Creating 20 Certificates...');
  for(let i=0; i<20; i++) {
    const c = rand(citizens);
    const type = rand(['birth', 'income', 'caste', 'residence']);
    const status = rand(['requested', 'processing', 'approved', 'issued', 'rejected']);
    await Certificate.create({
      cert_type: type,
      type: type,
      citizen_name: c.name,
      applicantName: c.name,
      purpose: 'Government requirements',
      status,
      certificateNumber: `CERT-${rNum(1000,9999)}`,
      issue_date: status === 'issued' ? rDate(10) : null,
      createdAt: rDate(100)
    });
  }

  console.log('Creating 15 Global Announcements...');
  const titles = ['Gram Sabha Meeting Scheduled', 'Vaccination Drive Next Week', 'Water Supply Disruption Notice', 'Panchayat Election Date Announced', 'New Welfare Scheme Available'];
  for(let i=0; i<15; i++) {
    await Notification.create({
      title: rand(titles),
      message: 'Please be informed regarding this important announcement from the Panchayat office.',
      type: 'announcement',
      createdBy: 'Admin',
      createdAt: rDate(60)
    });
  }

  console.log('Database Seeding Complete!');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
