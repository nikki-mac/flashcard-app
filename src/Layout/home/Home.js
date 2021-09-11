import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DeckCover from "./DeckCover";
import { listDecks, deleteDeck } from "../../utils/api/index";

function Home() {
  const [decks, setDecks] = useState([]);

  //Loads deck information
  useEffect(() => {
    setDecks([]);
    const abortController = new AbortController();

    async function loadDecks() {
      try {
        let _decks = await listDecks(abortController.signal);
        setDecks(_decks);
      } catch (error) {
        if (error.name === "AbortError") {
          console.info("Aborted");
        } else {
          throw error;
        }
      }
    }
    loadDecks();
    return () => {
      console.info("aborting");
      abortController.abort();
    };
  }, []);

  //Deletes a deck and triggers a re-render with the deck removed
  async function handleDeleteDeck(id) {
    if (
      window.confirm("Are you sure you want to delete this deck?\nYou will not be able to recover it once it's deleted.")
    ) {
      await deleteDeck(id);
      setDecks(() => decks.filter((deck) => deck.id !== id));
    }
  }

  //Maps decks to JSX elements
  const rows = decks.map((deck) => DeckCover({ ...deck, handleDeleteDeck }));

  return (
    <>
      <div className='row'>
        <Link to='/decks/new' className='btn btn-secondary'>
          <i className='bi bi-plus-lg'></i> Create Deck
        </Link>
      </div>
      <div className='row my-4'>{rows}</div>
    </>
  );
}

export default Home;