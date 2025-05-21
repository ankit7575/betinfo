import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Row, Col, Spin, Card } from "antd";

const BetfairData = () => {
  const { marketId } = useParams();
  const [betfairData, setBetfairData] = useState(null);
  const [scoreData, setScoreData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBetfairData = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://api.trovetown.co/v1/apiCalls?apiType=betfairData&marketId=${marketId}`
      );
      setBetfairData(response.data);
    } catch (error) {
      console.error("Error fetching Betfair data", error);
    }
  }, [marketId]);

  const fetchScoreData = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://api.trovetown.co/v1/apiCalls/scoreData?scoreId=${marketId}`
      );
      setScoreData(response.data.data[0]);
    } catch (error) {
      console.error("Error fetching Score data", error);
    }
  }, [marketId]);

  useEffect(() => {
    setLoading(true);
    fetchBetfairData();
    fetchScoreData();
    setLoading(false);
  }, [fetchBetfairData, fetchScoreData]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Betfair and Score Data for Market ID: {marketId}</h2>

      {loading ? (
        <Spin size="large" />
      ) : (
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Card title="Betfair Data">
              <pre>{JSON.stringify(betfairData, null, 2)}</pre>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Score Data">
              <pre>{JSON.stringify(scoreData, null, 2)}</pre>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default BetfairData;
