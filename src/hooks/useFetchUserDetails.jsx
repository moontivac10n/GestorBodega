import { useEffect, useState } from 'react';
import axios from 'axios';

const useFetchUserDetails = (userId, token) => {
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    //console.log(token)
    useEffect(() => {
        const fetchUserDetails = async () => {
            if (userId) {
                try {
                    const response = await axios.get(`http://localhost:4000/user/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setUserDetails(response.data);
                } catch (error) {
                    const errorMsg = error.response ? error.response.data.error : error.message;
                    console.error("Error fetching user details:", errorMsg);
                    setError(errorMsg);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUserDetails();
    }, [userId, token]);

    return { userDetails, loading, error };
};

export default useFetchUserDetails;
