import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  where,
  orderBy,
  limit,
  startAfter,
  query,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/spinner";

import ListingItem from "../components/listingItem";

function Category() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing]= useState(null); 
  const params = useParams();
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsRef = collection(db, "listings");
        const q = query(
          listingsRef,
          where("type", "==", params.categoryName),
          orderBy("timestamp", "desc"),
          limit(10)
        );
        const querySnap = await getDocs(q);
        const lastVisible= querySnap.docs[querySnap.docs.length-1]; 
        setLastFetchedListing(lastVisible); 
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error("Unable to get listings");
      }
    };
    fetchListings();
  }, []);

  const onFetchMoreListings = async () => {
    try {
      const listingsRef = collection(db, "listings");
      const q = query(
        listingsRef,
        where("type", "==", params.categoryName),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchedListing), 
        limit(10)
      );
      const querySnap = await getDocs(q);
      const lastVisible= querySnap.docs[querySnap.docs.length-1]; 
      setLastFetchedListing(lastVisible); 
      const listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings((prevState)=> {
        return (
          [
            ...prevState, 
            ...listings
          ]
        ); 
      });
      setLoading(false);
    } catch (error) {
      toast.error("Unable to get listings");
    }
  };

  return (
    <div className="category">
      <header>
        <p className="pageHeader">
          {params.categoryName === "rent"
            ? "Places for Rent"
            : "Places for Sale"}
        </p>
      </header>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
            <main>
                <ul className="categoryListings">
                    {listings.map((listing)=> {
                        return (
                            <ListingItem listing={listing.data} id={listing.id} key={listing.id} />
                        ); 
                    })}
                </ul>
            </main>
                    <br />
                    <br />
            {lastFetchedListing && (
              <p className="loadMore" onClick={onFetchMoreListings}>
                Load More
              </p>
            )}
        </>
      ) : (
        <p>No Listings for {params.categoryName}</p>
      )}
    </div>
  );
}
export default Category;
