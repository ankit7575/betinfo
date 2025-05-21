// calculateUserOdds.js

// Calculates user-specific odds based on admin odds and proportional investment
function calculateUserOdds(adminOdds, adminOpeningBalance, userOpeningBalance, userId) {
    // Ensure all values are valid numbers
    const adminOB = Number(adminOpeningBalance) || 1; // Prevent divide-by-zero
    const userOB = Number(userOpeningBalance) || 0;
  
    const multiplier = userOB / adminOB;
  
    return {
      userId: userId.toString(),
      selectionId: adminOdds.selectionId,
      runnerName: adminOdds.runnerName,
      odds: {
        back: Number(adminOdds.odds.back || 0),
        lay: Number(adminOdds.odds.lay || 0),
      },
      Ammount: {
        back: (adminOdds.Ammount?.back || 0) * multiplier,
        lay: (adminOdds.Ammount?.lay || 0) * multiplier
      },
      Profit: {
        back: (adminOdds.Profit?.back || 0) * multiplier,
        lay: (adminOdds.Profit?.lay || 0) * multiplier
      },
      referenceAdminOpeningBalance: adminOB,
      userOpeningBalance: userOB,
      createdAt: new Date()
    };
  }
  
  module.exports = {
    calculateUserOdds
  };
  