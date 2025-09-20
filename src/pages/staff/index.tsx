import { useEffect, useState } from 'react';
import { getStaffByBusinessId } from '../../api/api';
import Image from 'next/image';
import Head from 'next/head';

interface Staff {
  id: string;
  name: string;
  phone: string;
  speciality: string;
  aboutMe: string;
  address: string | null;
  isFeatured: boolean;
  photo: string;
  experience: number;
  numberOfClients: number;
  rating: number;
  interval: number;
  isAutoApproved: boolean;
  branchId: string;
}

const StaffList = () => {
  const [staff, setStaff] = useState<Staff[]>([]);

  useEffect(() => {
    getStaffByBusinessId().then((res) => {
      if (res && Array.isArray(res.message)) {
        setStaff(res.message);
      }
    });
  }, []);

  return (
    <>
      <Head>
        <title>Список специалистов</title>
      </Head>
      <main className="staff-list container">
        <h1>Список специалистов</h1>
        <div className="staff-column">
          {staff.map((person) => (
            <div key={person.id} className="staff-card">
              <div className="staff-photo">
                <Image
                  src={person.photo || '/images/пушистик обьятия.png'}
                  alt={person.name}
                  width={100}
                  height={100}
                  className="mascot-icon"
                />
              </div>
              <div className="staff-info">
                <h2>{person.name}</h2>
                <p>{person.speciality}</p>
                <p>{person.aboutMe}</p>
                <p>Опыт: {person.experience} лет</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default StaffList;
