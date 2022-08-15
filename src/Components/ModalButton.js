import React, { useEffect } from "react";
import { useState } from "react";
import { Modal, Button, Stack, Loader } from "@mantine/core";

export const ModalButton = ({ result }) => {
  const [opened, setOpened] = useState(false);
  const [activeCharacterData, setActiveCharacterData] = useState("");
  const [activeUrl, setActiveUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  console.log("modal component", result);

  useEffect(() => {
    let character = {};

    const fetchCharacters = async () => {
      setIsLoading(true);
      const response = await fetch(activeUrl);
      const data = await response.json();
      character = data;
      fetchHomePlanet();
    };

    const fetchHomePlanet = async () => {
      const response = await fetch(character.homeworld);
      const data = await response.json();
      let activeCharacterClone = { ...character };
      activeCharacterClone.homeWorld = data.name;

      let filmNames = [];

      for (let index in activeCharacterClone.films) {
        const response = await fetch(activeCharacterClone.films[index]);
        const data = await response.json();
        filmNames.push(data.title);
      }
      activeCharacterClone = { ...activeCharacterClone };
      activeCharacterClone.filmApperances = filmNames;
      console.log("activeCharacterClone", activeCharacterClone);
      setActiveCharacterData(activeCharacterClone);
      setIsLoading(false);
    };

    fetchCharacters();
  }, [activeUrl]);


  const clickHandler = (e) => {
    setActiveUrl(e);
    setOpened(true);
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={isLoading ? "loading..." : activeCharacterData.name}
      >
        {isLoading ? (
          <Loader size="sm" />
        ) : (
          <>
            <h3>Appeared in</h3>
            <ul>
              {activeCharacterData.filmApperances?.map((names) => {
                return <li>{names}</li>;
              })}
            </ul>
            <h3>Home Planet</h3>
            {activeCharacterData.homeWorld}

            <h3>Year of birth</h3>
            {activeCharacterData.birth_year}
            <h3>Eye Color</h3>
            {activeCharacterData.eye_color}
          </>
        )}
      </Modal>
      <Stack justify="flex-start" style={{ marginLeft: 80, marginRight: 80 }}>
        {result.map((character) => (
          <Button
            color="orange"
            key={character.name}
            onClick={() => clickHandler(character.url)}
          >
            {character.name}
          </Button>
        ))}
      </Stack>
    </>
  );
};
export default ModalButton;
