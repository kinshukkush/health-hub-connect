import Doctor from './models/Doctor.js';
import User from './models/User.js';

const doctors = [
  {
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@healthhub.com',
    specialization: 'Cardiology',
    qualification: 'MBBS, MD (Cardiology)',
    experience: 15,
    rating: 4.9,
    reviewCount: 245,
    consultationFee: 150,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200',
    available: true,
    nextAvailable: 'Today, 2:00 PM',
    bio: 'Specialist in cardiovascular diseases with over 15 years of experience.',
    languages: ['English', 'Spanish'],
    hospital: 'City General Hospital',
  },
  {
    name: 'Dr. Michael Chen',
    email: 'michael.chen@healthhub.com',
    specialization: 'Orthopedics',
    qualification: 'MBBS, MS (Orthopedics)',
    experience: 12,
    rating: 4.8,
    reviewCount: 189,
    consultationFee: 120,
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200',
    available: true,
    nextAvailable: 'Tomorrow, 10:00 AM',
    bio: 'Expert in joint replacement and sports injuries.',
    languages: ['English', 'Mandarin'],
    hospital: 'Metro Orthopedic Center',
  },
  {
    name: 'Dr. Emily Davis',
    email: 'emily.davis@healthhub.com',
    specialization: 'Pediatrics',
    qualification: 'MBBS, MD (Pediatrics)',
    experience: 10,
    rating: 4.9,
    reviewCount: 312,
    consultationFee: 100,
    avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200',
    available: true,
    nextAvailable: 'Today, 4:00 PM',
    bio: 'Dedicated to child healthcare and development.',
    languages: ['English'],
    hospital: 'Children\'s Medical Center',
  },
  {
    name: 'Dr. James Wilson',
    email: 'james.wilson@healthhub.com',
    specialization: 'Dermatology',
    qualification: 'MBBS, MD (Dermatology)',
    experience: 8,
    rating: 4.7,
    reviewCount: 156,
    consultationFee: 110,
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200',
    available: false,
    nextAvailable: 'Next week',
    bio: 'Specialist in skin conditions and cosmetic procedures.',
    languages: ['English', 'French'],
    hospital: 'Skin Care Clinic',
  },
  {
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@healthhub.com',
    specialization: 'Neurology',
    qualification: 'MBBS, DM (Neurology)',
    experience: 14,
    rating: 4.9,
    reviewCount: 278,
    consultationFee: 180,
    avatar: 'https://images.unsplash.com/photo-1638202993928-7267aad84c31?auto=format&fit=crop&q=80&w=200',
    available: true,
    nextAvailable: 'Tomorrow, 3:00 PM',
    bio: 'Expert in neurological disorders and brain health.',
    languages: ['English', 'Hindi'],
    hospital: 'Neuro Care Hospital',
  },
  {
    name: 'Dr. David Brown',
    email: 'david.brown@healthhub.com',
    specialization: 'General Medicine',
    qualification: 'MBBS, MD',
    experience: 20,
    rating: 4.8,
    reviewCount: 423,
    consultationFee: 80,
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200',
    available: true,
    nextAvailable: 'Today, 11:00 AM',
    bio: 'General physician with two decades of experience.',
    languages: ['English'],
    hospital: 'Community Health Center',
  },
];

export const seedDoctors = async () => {
  try {
    // Check if doctors already exist
    const count = await Doctor.countDocuments();
    
    if (count === 0) {
      await Doctor.insertMany(doctors);
      console.log('✅ Doctors seeded successfully');
    } else {
      console.log('ℹ️  Doctors already exist in database');
    }
  } catch (error) {
    console.error('❌ Error seeding doctors:', error);
  }
};

export const seedDemoUsers = async () => {
  try {
    // Check if demo users already exist
    const patientExists = await User.findOne({ email: 'patient@demo.com' });
    const adminExists = await User.findOne({ email: 'admin@demo.com' });
    
    if (!patientExists) {
      await User.create({
        email: 'patient@demo.com',
        password: 'demo123',
        name: 'Demo Patient',
        role: 'patient',
        phone: '555-0100',
      });
      console.log('✅ Demo patient created (patient@demo.com / demo123)');
    }
    
    if (!adminExists) {
      await User.create({
        email: 'admin@demo.com',
        password: 'demo123',
        name: 'Demo Admin',
        role: 'admin',
        phone: '555-0101',
      });
      console.log('✅ Demo admin created (admin@demo.com / demo123)');
    }
    
    if (patientExists && adminExists) {
      console.log('ℹ️  Demo users already exist');
    }
  } catch (error) {
    console.error('❌ Error seeding demo users:', error);
  }
};
