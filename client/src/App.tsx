import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:8080";

function App() {
  /**
   * invariant: 
   * - @param clientSeqNum is always equal to @param serverSeqNum if data has not been tampered with
   * - - they are also both non-decreasing
   * - @param backupData stores the lastest data client sent to the server
   * - 
   * 
   */
  const [data, setData] = useState("");
  const [serverSeqNum, setServerSeq] = useState(0);
  const [clientSeqNum, setClientSeqNum] = useState(0);
  const [backupData, setBackUp] = useState("");
  const address = "client1"

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    console.log("SeqNum updated:", serverSeqNum);
    if (clientSeqNum !== serverSeqNum) {
      // we know data has been tampered
      // resend data using the latest data
      console.log("Data has been tampered");
      alert("Data has been tampered");
      setClientSeqNum(serverSeqNum || 0);
      setData(backupData);
      updateData();
    }
  }, [serverSeqNum]); // This effect runs when serverSeqNum update

  /**
   * We not only get @param data, but the @param serverSeqNum
   * 
   * Each time server receives a post request and update the data in db, its seqNum increments by 1
   * so if client's seqNum != server's seqNum, it means the client's data was tampered
   * 
   * @effects
   * @param data is the latest data from server
   * @param serverSeqNum is the latest seqNum from server
   */
  const getData = async () => {
    const response = await fetch(API_URL);
    const { data, serverSeqNum } = await response.json();
    console.log("data from server: " + data);
    setData(data);
    setServerSeq(serverSeqNum);
  };

  /**
   * Everytime the client updates data using POST,
   * we update client's seqNum and store the data as the backup data
   * 
   * @effects 
   * @param clientSeqNum increment by one
   * @param backupData = @param data
   * 
   */
  const updateData = async () => {
    setBackUp(data || "");
    setClientSeqNum((prevNum) => prevNum + 1);
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ address, data }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    await getData();
  };

  const verifyData = async () => {
    await getData();
  };


  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        position: "absolute",
        padding: 0,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "20px",
        fontSize: "30px",
      }}
    >
      <div>Saved Data</div>
      <input
        style={{ fontSize: "30px" }}
        type="text"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />
  
      <div style={{ display: "flex", gap: "10px" }}>
        <button style={{ fontSize: "20px" }} onClick={updateData}>
          Update Data
        </button>
        <button style={{ fontSize: "20px" }} onClick={verifyData}>
          Verify Data
        </button>
      </div>
    </div>
  );
}

export default App;
