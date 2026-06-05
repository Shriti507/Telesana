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

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning 🌤️";
  if (hour < 17) return "Good afternoon ☀️";
  return "Good evening 🌙";
};

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
    const parts = pathname.split("/").filter(Boolean);
    const last = parts[parts.length - 1];
    if (!last || last === "dashboard") return "Dashboard";
    return last.charAt(0).toUpperCase() + last.slice(1).replace(/-/g, ' ');
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleArea}>
        <span className={styles.title}>{getPageTitle()}</span>
        <span className={styles.subtitle}>Welcome back!</span>
      </div>

      <div className={styles.menu}>
        <div className={styles.searchContainer}>
          <div className={styles.search}>
            <MdSearch size={18} />
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
          <button className={styles.iconBtn} title="Messages">
            <MdOutlineChat size={20} />
          </button>
          <button className={styles.iconBtn} title="Notifications">
            <MdNotifications size={20} />
            <span className={styles.badge}>3</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;