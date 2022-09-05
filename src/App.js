import { useEffect, useState } from "react";
import classes from "./App.module.css";
import "antd/dist/antd.css";
import { Col, Row } from "antd";
import { Table, Tag } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";

const statusColor = (statue) => {
  if (statue === "Alive") {
    return "green";
  } else if (statue === "Dead") {
    return "magenta";
  }
};

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: 180,
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Species",
    dataIndex: "species",
    key: "species",
    width: 180,
  },
  {
    title: "Gender",
    dataIndex: "gender",
    key: "gender",
    width: 180,
  },
  {
    title: "Status",
    key: "status",
    dataIndex: "status",
    width: 180,
    render: (status) => <Tag color={statusColor(status)}>{status}</Tag>,
  },
];

function App() {
  // https://rickandmortyapi.com/api/character?page=4
  const [charactersCurrentPage, setCharactersCurrentPage] = useState(1);
  const [characters, setCharacters] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  // const [charactersInfo, setCharactersInfo] = useState({count: 0});
  const fetchRickData = async () => {
    const response = await fetch(
      `https://rickandmortyapi.com/api/character?page=${charactersCurrentPage}`
    );
    const { info, results, error } = await response.json();
    if (error) {
      setHasMore(false);
    } else {
      setTimeout(() => {
        setCharacters((prevState) => [...prevState, ...results]);
        setCharactersCurrentPage((prevState) => prevState + 1);
      }, 500);
    }
  };

  useEffect(() => {
    fetchRickData();
  }, []);

  return (
    <div className={classes.App}>
      <Row justify="center">
        <Col>
          <InfiniteScroll
            dataLength={characters.length} //This is important field to render the next data
            next={fetchRickData}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            endMessage={
              <p style={{ textAlign: "center" }}>
                <b>Yay! You have seen it all</b>
              </p>
            }
          >
            <div className={classes.tableContainer}>
              <Table
                columns={columns}
                dataSource={characters}
                className={classes.table}
                pagination={{
                  position: ["none", "none"],
                  pageSize: characters.length,
                }}
              />
            </div>
          </InfiniteScroll>
        </Col>
      </Row>
    </div>
  );
}

export default App;
