import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";
import { setLogLevel } from "firebase/app";
import ListingItem from "../components/listingItem";

function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = formData;
  const [changeDetails, setDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, "listings");
      const q = query(
        listingsRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);

      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      console.log(listings);
      setListings(listings);
      setLoading(false);
    };

    fetchUserListings();
  }, []);

  const onLogout = () => {
    auth.signOut();
    navigate("/");
  };
  const onSubmit = async () => {
    try {
      if (auth.currentUser.name !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        if (auth.currentUser.email !== email) {
          await updateProfile(auth.currentUser, {
            email: email,
          });
        }

        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          name: name,
          email: email,
        });
        toast.success("Update Successful");
      }
    } catch (error) {
      toast.error("Update Unsuccessful, Try Again");
    }
  };
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  const onDelete= async (listingId)=> {
    if(window.confirm("Are you sure you want to remove this Listing")){
      await deleteDoc(doc(db, "listings", listingId)); 
      const updatedListings= listings.filter((listing)=> {
        return (
          listing.id!= listingId
        )
      })
      setListings(updatedListings); 
      toast.success("Deleted Listed Property"); 
    }
  }

  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button className="logOut" type="button" onClick={onLogout}>
          Logout
        </button>
      </header>
      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p
            className="changePersonalDetails"
            onClick={() => {
              changeDetails && onSubmit();
              setDetails((prevState) => {
                return !prevState;
              });
            }}
          >
            {changeDetails ? "Done" : "Change"}
          </p>
        </div>
        <div className="profileCard">
          <form className="">
            <input
              className={changeDetails ? "profileNameActive" : "profileName"}
              id="name"
              type="text"
              disabled={!changeDetails}
              onChange={onChange}
              value={name}
            />
            <input
              className="profileEmail"
              id="email"
              type="text"
              disabled={true}
              onChange={onChange}
              value={email}
            />
          </form>
        </div>
        <Link to="/create-listing" className="createListing">
          <img src={homeIcon} alt="Home" />
          <p>List you Property</p>
          <img src={arrowRight} alt="enter" />
        </Link>
        {!loading && listings?.length > 0 && (
          <>
            <p className="listingText">Your Listings</p>
            <ul className="listing.list">
              {listings.map((listing) => {
                return (
                  <ListingItem
                    key={listing.id}
                    listing={listing.data}
                    id={listing.id}
                    onDelete= {()=> onDelete(listing.id)}
                  />
                );
              })}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}

export default Profile;
