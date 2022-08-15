import "./App.css";
import React from "react";
import { useState, useEffect } from "react";
import { Select, Image, Grid, Pagination } from "@mantine/core";
import starWar from "./starWar.png";
import { ModalButton } from "./Components/ModalButton";

function App() {
  const [fetchData, setFetchData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [activePage, setPage] = useState(1);
  const [characters, setCharacters] = useState([]);

  const [peopleOfSpecies, setPeopleOfSpecies] = useState(null);
  const [pageCount, setPageCount] = useState(10);

  useEffect(() => {
    fetch("https://swapi.dev/api/people/1/")
      .then((response) => response.json())
      .then((data) => setFetchData(data));
  }, []);

  useEffect(() => {
    const fetchCharacters = async () => {
      const response = await fetch(
        `https://swapi.dev/api/people/?page=${activePage}`
      );
      const data = await response.json();
      const characters = data.results;
      characters.sort((a, b) =>
        a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
      );
      return setCharacters(characters);
    };

    fetchCharacters();
  }, [activePage]);

  useEffect(() => {
    console.log("peopleOfSpecies", peopleOfSpecies);

    const fetchData = async () => {
      const response = await fetch(peopleOfSpecies);
      const speciesPeople = await response.json();

      let characters = [];

      for (let index in speciesPeople.people) {
        const response = await fetch(speciesPeople.people[index]);
        const data = await response.json();
        console.log("data", data);
        characters.push(data);
      }
      characters.sort((a, b) =>
        a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
      );
      return setCharacters(characters);
    };

    fetchData();
  }, [peopleOfSpecies]);

  useEffect(() => {
    // declare the data fetching function
    const fetchData = async () => {
      const response = await fetch("https://swapi.dev/api/species/");
      const data = await response.json();

      return setSearchData(data.results);
    };

    const fetchCharacters = async () => {
      const response = await fetch("https://swapi.dev/api/people/");
      const data = await response.json();
      const dataPagesCount = Math.ceil(data.count / 10);
      console.log("dataPagesCount", data.count);
      setPageCount(dataPagesCount);
      const characters = data.results;
      characters.sort((a, b) =>
        a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
      );
      return setCharacters(characters);
    };

    // call the function
    fetchData();
    fetchCharacters()
      .catch(console.error);
  }, []);

  console.log(searchData);

  const result = searchData?.map((item) => {
    return { value: item.url, label: item.name, people: item.people };
  });

  console.log(result);

  return (
    <>
      <div className="App">
        <div style={{ width: 360, marginLeft: "auto", marginRight: "auto" }}>
          <Image radius="md" src={starWar} alt="star war" />
          <h1>Star Wars Characters</h1>
        </div>
        <Grid>
          <Grid.Col span={3} style={{ marginLeft: 80, marginBottom: 40 }}>
            <Select
              data={result}
              dropdownPosition="bottom"
              label="Filter By Species"
              onChange={setPeopleOfSpecies}
              value={peopleOfSpecies}
            />
          </Grid.Col>
        </Grid>
        <ModalButton result={characters} />
        <Pagination
          style={{ marginLeft: 80, marginTop: 80, marginBottom: 40 }}
          page={activePage}
          onChange={setPage}
          total={pageCount}
        />
      </div>
    </>
  );
}

export default App;
