import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams, useHistory, useRouteMatch } from "react-router-dom";
import { readDeck, deleteDeck, deleteCard } from "../../utils/api";
import NotFound from "../NotFound";
import CardList from "./CardList";

function DeckDetails() {
  const [deckInfo, setDeckInfo] = useState({});
  const { deckId } = useParams();
  const { url } = useRouteMatch();
  const history = useHistory();
  const { name, description } = deckInfo;

  //Loads deck information. If deck isn't found, displays "Not Found"
  //useCallBack() returns a memorized version of a callback.
  const getDeckDetails = useCallback(async () => {
    try {
      const deck = await readDeck(deckId);
      setDeckInfo(deck);
    } catch (error) {
      setDeckInfo({ name: "Not Found" });
    }
  }, [deckId]);

  //Load deck information on any change to deckId
  //getDeckDetails is required as a dependency since it's defined outside of useEffect()
  useEffect(() => {
    getDeckDetails();
  }, [deckId, getDeckDetails]);

  //Deletes card and re-loads deck information
  async function deleteCardHandler(id) {
    if (
      window.confirm(
        "Are you sure you want to delete this card?\nYou will not be able to recover it once it's deleted."
      )
    ) {
      await deleteCard(id);
      getDeckDetails();
    }
  }

  //Handles incorrect deckId
  if (name === "Not Found") return <NotFound />;

  //Deletes deck and goes back to home page
  async function deleteDeckHandler() {
    if (
      window.confirm(
        "Are you sure you want to delete this deck?\nYou will not be able to recover it once it's deleted."
      )
    ) {
      await deleteDeck(deckId);
      history.push("/");
    }
  }

  return (
    <div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">
              <i className="bi bi-house-door-fill"></i> Home
            </Link>
          </li>

          <li className="breadcrumb-item active" aria-current="page">
            {name}
          </li>
        </ol>
      </nav>

      <h3>{name}</h3>

      <p>{description}</p>

      <div className="deck-card-buttons">
        <Link className="btn btn-secondary" to={`${url}/edit`}>
          <i className="bi bi-pencil-fill"></i> Edit
        </Link>

        <Link className="btn btn-primary" to={`${url}/study`}>
        <i className="bi bi-journal-check"></i> Study
        </Link>

        <Link className="btn btn-primary" to={`${url}/cards/new`}>
          <i className="bi bi-plus-lg"></i> Add Cards
        </Link>

        <button
          className="btn btn-danger delete-deck"
          onClick={deleteDeckHandler}
        >
          <i className="bi bi-trash"></i>
        </button>
      </div>

      <CardList deck={deckInfo} deleteHandler={deleteCardHandler} />
    </div>
  );
}

export default DeckDetails;