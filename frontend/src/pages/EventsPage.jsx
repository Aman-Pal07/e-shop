import React from "react";
import { useSelector } from "react-redux";
import EventCard from "../components/Events/EventCard";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";

const EventsPage = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={4} />
          <div className="flex flex-wrap gap-5 justify-center mt-5">
            {allEvents && allEvents.length > 0 ? (
              allEvents.map((event, index) => (
                <EventCard
                  key={event._id || index}
                  active={true}
                  data={event}
                />
              ))
            ) : (
              <p className="text-gray-500 text-center">No events available</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default EventsPage;
