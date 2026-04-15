"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import styles from "./navbar.module.css";
import {
  MdNotifications,
  MdOutlineChat,
  MdSearch,
} from "react-icons/md";
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API || "http://localhost:4000";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setShowResults(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/doctors`, {
        credentials: "include",
      });

      if (response.ok) {
        const doctors = await response.json();
        const filtered = doctors.filter(doc =>
          doc.doctor_name.toLowerCase().includes(query.toLowerCase()) ||
          doc.specialisation.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filtered);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const getPageTitle = () => {
    const path = pathname.split("/").pop();
    return path.charAt(0).toUpperCase() + path.slice(1) || "Dashboard";
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>{getPageTitle()}</div>
      <div className={styles.menu}>
        <div className={styles.searchContainer}>
          <div className={styles.search}>
            <MdSearch />
            <input
              type="text"
              placeholder="Search doctors, specializations..."
              className={styles.input}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
            />
          </div>
          {showResults && searchResults.length > 0 && (
            <div className={styles.searchResults}>
              {searchResults.map((doctor) => (
                <div
                  key={doctor.id}
                  className={styles.resultItem}
                  onClick={() => {
                    router.push('/dashboard/Appointments');
                    setShowResults(false);
                  }}
                >
                  <p className={styles.doctorName}>Dr. {doctor.doctor_name}</p>
                  <p className={styles.doctorSpec}>{doctor.specialisation}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className={styles.icons}>
          <MdOutlineChat size={20} />
          <MdNotifications size={20} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;