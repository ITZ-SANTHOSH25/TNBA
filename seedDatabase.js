// ============================================================================
// SEED DATABASE - Dummy Data for Testing & Development
// ============================================================================

const User = require('../models/User');
const Donor = require('../models/Donor');
const BloodBank = require('../models/BloodBank');
const Hospital = require('../models/Hospital');
const BloodRequest = require('../models/BloodRequest');
const DonationCamp = require('../models/DonationCamp');
const Notification = require('../models/Notification');
const Feedback = require('../models/Feedback');

const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('📦 Database already seeded. Skipping...');
      return;
    }

    console.log('🌱 Seeding database with dummy data...');

    // Create Admin User
    const adminUser = await User.create({
      Name: 'Admin TNBBMS', Email: 'admin@tnbbms.in', Mobile: '9876543210',
      Password: 'admin123', Role: 'Admin'
    });
    console.log('  ✅ Admin user created');

    // Create Blood Bank Users
    const bbUser1 = await User.create({
      Name: 'Chennai Blood Bank', Email: 'chennai.bb@tnbbms.in', Mobile: '9876543211',
      Password: 'bb123456', Role: 'BloodBank'
    });
    const bbUser2 = await User.create({
      Name: 'Coimbatore Blood Bank', Email: 'coimbatore.bb@tnbbms.in', Mobile: '9876543212',
      Password: 'bb123456', Role: 'BloodBank'
    });
    const bbUser3 = await User.create({
      Name: 'Madurai Blood Bank', Email: 'madurai.bb@tnbbms.in', Mobile: '9876543213',
      Password: 'bb123456', Role: 'BloodBank'
    });
    const bbUser4 = await User.create({
      Name: 'Salem Blood Bank', Email: 'salem.bb@tnbbms.in', Mobile: '9876543214',
      Password: 'bb123456', Role: 'BloodBank'
    });
    console.log('  ✅ Blood bank users created');

    // Create Hospital Users
    const hospUser1 = await User.create({
      Name: 'GH Chennai', Email: 'gh.chennai@tnbbms.in', Mobile: '9876543221',
      Password: 'hosp1234', Role: 'Hospital'
    });
    const hospUser2 = await User.create({
      Name: 'CMC Vellore', Email: 'cmc.vellore@tnbbms.in', Mobile: '9876543222',
      Password: 'hosp1234', Role: 'Hospital'
    });
    const hospUser3 = await User.create({
      Name: 'GH Madurai', Email: 'gh.madurai@tnbbms.in', Mobile: '9876543223',
      Password: 'hosp1234', Role: 'Hospital'
    });
    console.log('  ✅ Hospital users created');

    // Create Donor Users
    const donorUsers = [];
    const donorData = [
      { Name: 'Arun Kumar', Email: 'arun@gmail.com', Mobile: '9988776601' },
      { Name: 'Priya Ramesh', Email: 'priya@gmail.com', Mobile: '9988776602' },
      { Name: 'Suresh Babu', Email: 'suresh@gmail.com', Mobile: '9988776603' },
      { Name: 'Lakshmi Devi', Email: 'lakshmi@gmail.com', Mobile: '9988776604' },
      { Name: 'Karthik Rajan', Email: 'karthik@gmail.com', Mobile: '9988776605' },
      { Name: 'Meena Kumari', Email: 'meena@gmail.com', Mobile: '9988776606' },
      { Name: 'Vijay Prakash', Email: 'vijay@gmail.com', Mobile: '9988776607' },
      { Name: 'Anitha Selvam', Email: 'anitha@gmail.com', Mobile: '9988776608' },
      { Name: 'Rajesh Muthu', Email: 'rajesh@gmail.com', Mobile: '9988776609' },
      { Name: 'Deepa Narayanan', Email: 'deepa@gmail.com', Mobile: '9988776610' }
    ];
    for (const d of donorData) {
      const user = await User.create({ ...d, Password: 'donor123', Role: 'Donor' });
      donorUsers.push(user);
    }
    console.log('  ✅ Donor users created');

    // Create Donor Profiles
    const donorProfiles = [
      { BloodGroup: 'O+', Age: 28, Weight: 72, Availability: 'Available', Address: 'T. Nagar, Chennai' },
      { BloodGroup: 'A+', Age: 32, Weight: 65, Availability: 'Available', Address: 'RS Puram, Coimbatore' },
      { BloodGroup: 'B+', Age: 25, Weight: 68, Availability: 'Available', Address: 'Anna Nagar, Madurai' },
      { BloodGroup: 'O-', Age: 30, Weight: 58, Availability: 'Unavailable', Address: 'Salem Town, Salem', LastDonationDate: new Date('2024-11-15') },
      { BloodGroup: 'AB+', Age: 35, Weight: 75, Availability: 'Available', Address: 'Velachery, Chennai' },
      { BloodGroup: 'A-', Age: 27, Weight: 55, Availability: 'Available', Address: 'Gandhipuram, Coimbatore' },
      { BloodGroup: 'B-', Age: 40, Weight: 70, Availability: 'Deferred', Address: 'KK Nagar, Madurai' },
      { BloodGroup: 'O+', Age: 22, Weight: 60, Availability: 'Available', Address: 'Besant Nagar, Chennai' },
      { BloodGroup: 'AB-', Age: 33, Weight: 80, Availability: 'Available', Address: 'Five Roads, Salem' },
      { BloodGroup: 'A+', Age: 29, Weight: 62, Availability: 'Available', Address: 'Adyar, Chennai' }
    ];
    for (let i = 0; i < donorUsers.length; i++) {
      await Donor.create({
        userId: donorUsers[i]._id, Name: donorUsers[i].Name, Email: donorUsers[i].Email,
        Mobile: donorUsers[i].Mobile, ...donorProfiles[i]
      });
    }
    console.log('  ✅ Donor profiles created');

    // Create Blood Banks
    await BloodBank.create({
      Name: 'Chennai Government Blood Bank', District: 'Chennai', Contact: '044-28765501',
      BloodStock: { 'A+': 45, 'A-': 12, 'B+': 38, 'B-': 8, 'AB+': 20, 'AB-': 5, 'O+': 55, 'O-': 10 },
      Location: { type: 'Point', coordinates: [80.2785, 13.0827] }, userId: bbUser1._id
    });
    await BloodBank.create({
      Name: 'Coimbatore District Blood Bank', District: 'Coimbatore', Contact: '0422-2308650',
      BloodStock: { 'A+': 30, 'A-': 10, 'B+': 25, 'B-': 6, 'AB+': 15, 'AB-': 3, 'O+': 40, 'O-': 8 },
      Location: { type: 'Point', coordinates: [76.9558, 11.0168] }, userId: bbUser2._id
    });
    await BloodBank.create({
      Name: 'Madurai Central Blood Bank', District: 'Madurai', Contact: '0452-2341560',
      BloodStock: { 'A+': 22, 'A-': 7, 'B+': 18, 'B-': 4, 'AB+': 12, 'AB-': 2, 'O+': 30, 'O-': 5 },
      Location: { type: 'Point', coordinates: [78.1198, 9.9252] }, userId: bbUser3._id
    });
    await BloodBank.create({
      Name: 'Salem Blood Bank', District: 'Salem', Contact: '0427-2422550',
      BloodStock: { 'A+': 15, 'A-': 5, 'B+': 12, 'B-': 3, 'AB+': 8, 'AB-': 1, 'O+': 20, 'O-': 4 },
      Location: { type: 'Point', coordinates: [78.1583, 11.6643] }, userId: bbUser4._id
    });
    console.log('  ✅ Blood banks created');

    // Create Hospitals
    await Hospital.create({ Name: 'Government General Hospital', Address: 'Chennai, Tamil Nadu 600003', Contact: '044-25360500', userId: hospUser1._id });
    await Hospital.create({ Name: 'Christian Medical College', Address: 'Vellore, Tamil Nadu 632004', Contact: '0416-2281000', userId: hospUser2._id });
    await Hospital.create({ Name: 'Government Rajaji Hospital', Address: 'Madurai, Tamil Nadu 625020', Contact: '0452-2526661', userId: hospUser3._id });
    console.log('  ✅ Hospitals created');

    // Create Blood Requests
    await BloodRequest.create({
      PatientName: 'Ravi Shankar', Hospital: 'Government General Hospital, Chennai',
      BloodGroup: 'O-', UnitsRequired: 3, Urgency: 'Critical', RequestedBy: hospUser1._id, Status: 'Pending'
    });
    await BloodRequest.create({
      PatientName: 'Kavitha S', Hospital: 'Christian Medical College, Vellore',
      BloodGroup: 'A+', UnitsRequired: 2, Urgency: 'Urgent', RequestedBy: hospUser2._id, Status: 'Approved'
    });
    await BloodRequest.create({
      PatientName: 'Murugan P', Hospital: 'Government Rajaji Hospital, Madurai',
      BloodGroup: 'B+', UnitsRequired: 1, Urgency: 'Normal', RequestedBy: hospUser3._id, Status: 'Fulfilled'
    });
    await BloodRequest.create({
      PatientName: 'Selvi K', Hospital: 'Government General Hospital, Chennai',
      BloodGroup: 'AB-', UnitsRequired: 2, Urgency: 'Critical', RequestedBy: hospUser1._id, Status: 'Pending'
    });
    await BloodRequest.create({
      PatientName: 'Thangavel R', Hospital: 'Christian Medical College, Vellore',
      BloodGroup: 'O+', UnitsRequired: 4, Urgency: 'Urgent', RequestedBy: hospUser2._id, Status: 'Pending'
    });
    console.log('  ✅ Blood requests created');

    // Create Donation Camps
    await DonationCamp.create({
      CampName: 'Chennai Mega Blood Donation Drive', Date: new Date('2025-02-15'),
      Time: '09:00 AM - 05:00 PM', Venue: 'Chennai Trade Centre, Nandambakkam', Organizer: 'Tamil Nadu Red Cross Society', CreatedBy: adminUser._id
    });
    await DonationCamp.create({
      CampName: 'Coimbatore Youth Blood Camp', Date: new Date('2025-03-01'),
      Time: '08:00 AM - 04:00 PM', Venue: 'CODISSIA Trade Fair Complex, Coimbatore', Organizer: 'Rotary Club of Coimbatore', CreatedBy: bbUser2._id
    });
    await DonationCamp.create({
      CampName: 'Madurai Temple City Blood Drive', Date: new Date('2025-03-15'),
      Time: '10:00 AM - 03:00 PM', Venue: 'Madurai Corporation Ground', Organizer: 'Lions Club Madurai', CreatedBy: bbUser3._id
    });
    await DonationCamp.create({
      CampName: 'Salem Voluntary Blood Donation Camp', Date: new Date('2025-01-10'),
      Time: '09:00 AM - 01:00 PM', Venue: 'Salem GH Campus', Organizer: 'Salem Doctors Association', CreatedBy: bbUser4._id
    });
    console.log('  ✅ Donation camps created');

    // Create Notifications
    await Notification.create({ Title: 'Urgent: O- Blood Needed', Description: 'Critical shortage of O-negative blood across Tamil Nadu. All eligible donors are requested to donate immediately.', CreatedBy: adminUser._id });
    await Notification.create({ Title: 'New Donation Camp in Chennai', Description: 'A mega blood donation drive is being organized at Chennai Trade Centre on February 15, 2025. Register now!', CreatedBy: adminUser._id });
    await Notification.create({ Title: 'World Blood Donor Day', Description: 'Celebrate World Blood Donor Day on June 14. Participate in events across Tamil Nadu and help save lives.', CreatedBy: adminUser._id });
    await Notification.create({ Title: 'System Maintenance Notice', Description: 'The TNBBMS portal will undergo scheduled maintenance on Jan 20, 2025, from 2 AM to 5 AM IST.', CreatedBy: adminUser._id });
    console.log('  ✅ Notifications created');

    // Create Feedback
    await Feedback.create({ Name: 'Arun Kumar', Rating: 5, Message: 'Excellent platform! Very easy to find blood availability. Saved my uncle\'s life with quick O- blood search.', userId: donorUsers[0]._id });
    await Feedback.create({ Name: 'Priya Ramesh', Rating: 4, Message: 'Great initiative by Tamil Nadu government. The donation camp registration process is smooth and efficient.', userId: donorUsers[1]._id });
    await Feedback.create({ Name: 'Dr. Senthil', Rating: 5, Message: 'As a hospital administrator, this system has streamlined our blood request process significantly. Highly recommended.', userId: hospUser1._id });
    await Feedback.create({ Name: 'Rajesh Muthu', Rating: 3, Message: 'Good system but would like to see real-time blood stock updates. Sometimes the stock numbers seem outdated.', userId: donorUsers[8]._id });
    await Feedback.create({ Name: 'Deepa Narayanan', Rating: 4, Message: 'The notification feature is very helpful. I got alerted about a camp near me and was able to donate blood.', userId: donorUsers[9]._id });
    console.log('  ✅ Feedback created');

    console.log('\n🎉 Database seeded successfully with dummy data!\n');
    console.log('══════════════════════════════════════════════════════════════════════════════');
    console.log('  TEST CREDENTIALS:');
    console.log('══════════════════════════════════════════════════════════════════════════════');
    console.log('  🔑 Admin      → admin@tnbbms.in  / admin123');
    console.log('  🔑 Blood Bank  → chennai.bb@tnbbms.in  / bb123456');
    console.log('  🔑 Hospital    → gh.chennai@tnbbms.in  / hosp1234');
    console.log('  🔑 Donor       → arun@gmail.com  / donor123');
    console.log('══════════════════════════════════════════════════════════════════════════════\n');
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
  }
};

module.exports = seedDatabase;
