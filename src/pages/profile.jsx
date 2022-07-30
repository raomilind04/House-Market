import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";

function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = formData;
  const [changeDetails, setDetails] = useState(false);

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
        toast.success("Update Successful")
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
      </main>
    </div>
  );
}

export default Profile;
