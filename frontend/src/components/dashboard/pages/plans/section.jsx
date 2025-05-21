import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllPlans,
  addPlan,
  editPlan,
  deletePlan,
} from '../../../../actions/planAction';
import './section.css';
import { Modal, Button, Form } from 'react-bootstrap';
import { Helmet } from 'react-helmet';  // Import Helmet for managing head

const Section = () => {
  const dispatch = useDispatch();
  const { plans, loading, error } = useSelector((state) => state.planList || {});

  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPlanId, setCurrentPlanId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    totalCoins: '',
  });

  // Load plans on component mount
  useEffect(() => {
    dispatch(getAllPlans());
  }, [dispatch]);

  const openAddModal = () => {
    setForm({ name: '', description: '', price: '', totalCoins: '' });
    setIsEditMode(false);
    setShowModal(true);
  };

  const openEditModal = (plan) => {
    setForm({
      name: plan.name,
      description: plan.description,
      price: plan.price,
      totalCoins: plan.totalCoins,
    });
    setCurrentPlanId(plan._id);
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      await dispatch(deletePlan(id));
      dispatch(getAllPlans()); // Refresh list
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isEditMode) {
      await dispatch(editPlan(currentPlanId, form));
    } else {
      await dispatch(addPlan(form));
    }
    setShowModal(false);
    dispatch(getAllPlans()); // Refresh list
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === 'price' || name === 'totalCoins' ? Number(value) : value,
    });
  };

  return (
    <div className="admin-plan-container">
      {/* Add Helmet for dynamic title */}
      <Helmet>
        <title>{isEditMode ? 'Edit Plan' : 'Manage Subscription Plans'}</title>
      </Helmet>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Manage Subscription Plans</h2>
        <Button variant="success" onClick={openAddModal}>Add Plan</Button>
      </div>

      {loading && <div>Loading plans...</div>}
      {error && <div className="text-danger">Error: {error}</div>}

      {!loading && plans && plans.length > 0 ? (
        <>
          {/* Desktop Table */}
          <div className="d-none d-md-block table-responsive">
            <table className="table table-bordered table-striped text-center">
              <thead className="thead-dark">
                <tr>
                  <th>#</th>
                  <th>Plan Name</th>
                  <th>Description</th>
                  <th>Price ($)</th>
                  <th>Total Coins</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan, index) => (
                  <tr key={plan._id}>
                    <td>{index + 1}</td>
                    <td>{plan.name}</td>
                    <td>{plan.description}</td>
                    <td>{plan.price}</td>
                    <td>{plan.totalCoins}</td>
                    <td>
                      <Button variant="primary" size="sm" className="me-2" onClick={() => openEditModal(plan)}>Edit</Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(plan._id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="d-md-none">
            {plans.map((plan) => (
              <div className="card mb-3 shadow-sm" key={plan._id}>
                <div className="card-body">
                  <h5 className="card-title">{plan.name}</h5>
                  <p className="card-text">{plan.description}</p>
                  <p className="card-text">
                    <strong>Price:</strong> {plan.price} USDT<br />
                    <strong>Total Coins:</strong> {plan.totalCoins}
                  </p>
                  <div className="d-flex justify-content-between">
                    <Button variant="primary" size="sm" onClick={() => openEditModal(plan)}>Edit</Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(plan._id)}>Delete</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        !loading && <div>No plans available.</div>
      )}

      {/* Modal for Add/Edit */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Form onSubmit={handleFormSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{isEditMode ? 'Edit Plan' : 'Add Plan'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Plan Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="description"
                value={form.description}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price ($)</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Total Coins</Form.Label>
              <Form.Control
                type="number"
                name="totalCoins"
                value={form.totalCoins}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="success" type="submit">
              {isEditMode ? 'Update Plan' : 'Add Plan'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Section;
