import { useEffect, useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import Cookies from 'js-cookie';
import { useGetAdminStatusQuery, useLogOutMutation, useUpdateAdminStatusMutation } from "../../services/api/authApi";
import { HatGlasses } from "lucide-react";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const Info = JSON.parse(Cookies.get('user') || '{}');
  const [isOnline, setIsOnline] = useState(false);
  const token = Cookies.get('token');
  const [logOut, { isLoading }] = useLogOutMutation();
  const [updateAdminStatus, { isLoading: isUpdating }] = useUpdateAdminStatusMutation();
  const {data , isLoading: isLoadingAdmin} = useGetAdminStatusQuery();
  const admin = data?.data?.[0]; 

  /**
   * @get current admin status
   * @description get admin status from server
   */
  useEffect(() => {
    if (!isLoadingAdmin) {
      setIsOnline(admin?.is_online || false);
    }
  }, [admin, isLoadingAdmin]);



  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  /**
   * @handle Logout user
   */
  const handleLogout = async () => {
    if (!token) return;
    // logout process
    try {
      const response = await logOut(token).unwrap();
      if (response?.success) {
        setIsOpen(false);
        Cookies.remove('token');
        Cookies.remove('user');
        Cookies.remove('is_online');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  /**
   * @function handleSwitchOn
   * @handle Switch Online
   */
  const handleSwitchOn = async () => {
    if(!token && !Info?.user_id && !Info?.is_admin) return;
    try {
      const response = await updateAdminStatus({ token: token || '', userId: Info?.id, isOnline: true }).unwrap();
      if (response?.success) {
        setIsOnline(true);
        Cookies.set('is_online', 'true');
      }else{
        setIsOnline(false);
      }
    } catch (error) {
      console.error('Error updating admin status:', error);
      setIsOnline(false)
    }
  };

  const handleSwitchOff = async () => {
     if(!token && !Info?.user_id && !Info?.is_admin) return;
    try {
      const response = await updateAdminStatus({ token: token || '', userId: Info?.id, isOnline: false }).unwrap();
      if (response?.success) {
        setIsOnline(false);
        Cookies.set('is_online', 'false');
      }else{
        setIsOnline(true);
      }
    } catch (error) {
      console.error('Error updating admin status:', error);
      setIsOnline(true);
    }
  };
  
  const toggleSwitch = () => {
    if (!isOnline) handleSwitchOn();
    else handleSwitchOff();
    setIsOnline(!isOnline);
  };


  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dark:text-gray-400"
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          <img
            src="https://i.pinimg.com/736x/72/46/87/7246874eadd23a35d6c1557b6dcc6043.jpg"
            alt="admin"
            className="object-cover object-center h-full w-full"
          />
        </span>
        <span className="mr-1 font-medium text-theme-sm">{Info?.username}</span>
        <svg
          className={`transition-transform duration-200 stroke-gray-500 dark:stroke-gray-400 ${isOpen ? "rotate-180" : ""
            }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] w-[260px] rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div>
          <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
            {Info?.username}
          </span>
          <span className="block mt-0.5 text-theme-xs text-gray-500 dark:text-gray-400">
            {Info?.phone_number}
          </span>
        </div>

        <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
          {/* ✅ Switch Button */}
          <li className="flex items-center justify-between px-3 py-2 font-medium text-gray-700 rounded-lg text-theme-sm hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
            <div className="flex items-center gap-3">
              <HatGlasses />
              {isUpdating ? 'Updating...' : 'Switch Online'}
            </div>
            <label className={`relative inline-flex items-center ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
              <input
                type="checkbox"
                checked={isOnline}
                onChange={toggleSwitch}
                disabled={isUpdating}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </li>
        </ul>

        <button
          disabled={isLoading}
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg text-theme-sm hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
        >
          <svg
            className="fill-gray-500 dark:group-hover:fill-gray-300"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.1 19.25c-.41 0-.75-.34-.75-.75v-4.25h-1.5v4.25c0 1.24 1.01 2.25 2.25 2.25h3.4c1.24 0 2.25-1.01 2.25-2.25V5.5c0-1.24-1.01-2.25-2.25-2.25h-3.4c-1.24 0-2.25 1.01-2.25 2.25v4.25h1.5V5.5c0-.41.34-.75.75-.75h3.4c.41 0 .75.34.75.75v13.75c0 .41-.34.75-.75.75h-3.4ZM3.25 12c0 .22.09.43.24.58l4.61 4.61c.29.29.76.29 1.06 0 .29-.29.29-.77 0-1.06l-3.96-3.96H16a.75.75 0 0 0 0-1.5H5.2l3.96-3.96a.75.75 0 0 0-1.06-1.06L3.49 11.42a.75.75 0 0 0-.24.58Z"
            />
          </svg>
          {isLoading ? 'Loading...' : 'Logout'}
        </button>
      </Dropdown>
    </div>
  );
}
