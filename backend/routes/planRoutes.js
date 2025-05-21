const express = require("express");
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const {
  addPlan,
  getAllPlans,
  getPlanById,
  editPlan,
  deletePlan,
  selectPlan,
  checkSelectedPlanExpiration,
  clearExpiredPlans,
} = require("../controller/planController");

// Route to add a new plan
router.post("/add", isAuthenticatedUser, authorizeRoles("admin"), addPlan);

// Route to get all plans
router.get("/", isAuthenticatedUser, getAllPlans);

// Route to get a specific plan by its ID
router.get("/:id", isAuthenticatedUser, getPlanById);

// Route to edit a plan by its ID
router.put("/:id", isAuthenticatedUser, authorizeRoles("admin"), editPlan);

// Route to delete a plan by its ID
router.delete("/:id", isAuthenticatedUser, authorizeRoles("admin"), deletePlan);

// Route to select a plan and store it temporarily for transaction
router.post("/select", isAuthenticatedUser, selectPlan);

// Route to check if the selected plan is expired
router.get("/check-expiration", isAuthenticatedUser, checkSelectedPlanExpiration);

// Route to clear expired plans from temporary storage
router.delete("/clear-expired", isAuthenticatedUser, clearExpiredPlans);

module.exports = router;
