import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { db } from "../firebase.config";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/a11y";
import Spinner from "./spinner";

function Slider() {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      const listingRef = collection(db, "listings");
      const q = query(listingRef, orderBy("timestamp", "desc"), limit(5));
      const querySnap = await getDocs(q);

      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings(listings);
      setLoading(false);
    };

    fetchListing();
  }, []);

  if (!loading) {
    <Spinner />;
  }

  return (
    listings && (
      <>
        <p className="exploreHeading">Recommended</p>
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          slidesPerView={1}
          pagination={{ clickable: true }}
          navigation
          style={{ height: "300px" }}
        >
          {listings.map(({ data, id }) => {
            return (
              <SwiperSlide key={id} onClick= {()=> (navigate(`/category/${data.type}/${id}`))}>
                <div
                  className="swiperSlideDiv"
                  style={{
                    background: `url(${data.imageUrls[0]}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                >
                    <div className="swiperSlideText">
                        {data.name}
                    </div>
                    <div className="swiperSlidePrice">
                        ${data.offer ? data.discountedPrice : data.regularPrice}
                        {" "}
                        {data.type== "rent" && "/Month"}
                    </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </>
    )
  );
}

export default Slider;
