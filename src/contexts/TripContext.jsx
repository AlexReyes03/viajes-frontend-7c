import React, { createContext, useContext, useState } from 'react';

const TripContext = createContext(null);

export const useTripContext = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTripContext must be used within a TripProvider');
  }
  return context;
};

export const TripProvider = ({ children }) => {
  const [tripState, setTripState] = useState('idle'); // idle, request, searching, pickup, arrived, ongoing, dropoff, finished
  const [currentTrip, setCurrentTrip] = useState(null);
  const [showTripCard, setShowTripCard] = useState(false);

  const updateTripState = (newState) => {
    setTripState(newState);
    if (newState !== 'idle') {
      setShowTripCard(true);
    }
  };

  const updateCurrentTrip = (tripData) => {
    setCurrentTrip(tripData);
    if (tripData) {
      setShowTripCard(true);
    }
  };

  const resetTrip = () => {
    setTripState('idle');
    setCurrentTrip(null);
    setShowTripCard(false);
  };

  const startNewTrip = (tripData, state = 'searching') => {
    setCurrentTrip(tripData);
    setTripState(state);
    setShowTripCard(true);
  };

  const hideTripCard = () => {
    setShowTripCard(false);
  };

  const showTripCardAgain = () => {
    setShowTripCard(true);
  };

  const value = {
    // State
    tripState,
    currentTrip,
    showTripCard,

    // Methods
    updateTripState,
    updateCurrentTrip,
    resetTrip,
    startNewTrip,
    hideTripCard,
    showTripCardAgain,
    setTripState,
    setCurrentTrip,
    setShowTripCard
  };

  return (
    <TripContext.Provider value={value}>
      {children}
    </TripContext.Provider>
  );
};

export default TripContext;
