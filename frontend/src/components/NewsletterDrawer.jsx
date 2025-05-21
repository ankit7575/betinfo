import React from "react";
import { Drawer } from "antd";

const NewsletterDrawer = ({ isDrawerVisible, closeDrawer }) => {
  return (
    <Drawer title="Newsletter" open={isDrawerVisible} onClose={closeDrawer}>
      <p>Subscribe to our newsletter for updates!</p>
    </Drawer>
  );
};

export default NewsletterDrawer;
