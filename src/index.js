import ReactDOM from "react-dom";
import React, { useState } from "react";
import { useSwipeable, Swipeable } from "react-swipeable";
import {
  constructMatrixFromTemplate,
  getLocation,
  mapMatrix,
  updateMatrix,
} from "functional-game-utils";

const TILE_SIZE = 32;

const parseMapTemplate = constructMatrixFromTemplate((char) => {
  switch (char) {
    case ".":
      return {};
    case "x":
      return { icon: "X", bgColor: "gray" };
    default:
      return {};
  }
});

function Tile({ icon, bgColor, location, isOver, moveTile }) {
  return (
    <div
      style={{
        backgroundColor: bgColor,
        width: `${TILE_SIZE}px`,
        height: `${TILE_SIZE}px`,
        border: "1px black solid",
      }}
    >
      {icon}
    </div>
  );
}

function Grid({ tiles, renderTile }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `${TILE_SIZE}px `.repeat(tiles.length),
      }}
    >
      {mapMatrix(renderTile, tiles)}
    </div>
  );
}

const App = () => {
  const [tiles, setTiles] = useState(
    parseMapTemplate(`
        . . . . . . . . . .
        . . . . . . . . . .
        . . . . . . . . . .
        . . . . . . . . . .
        . . . . . x . . . .
        . . . . . . . . . .
        . . . . . . . . . .
        . . . . . . . . . .
        . . . . . . . . . .
        . . . . . . . . . .
    `)
  );
  const swipeableConfig = {
    trackTouch: true,
    trackMouse: true,
  };
  // NOT_SWIPING, MOUSE_DOWN, SWIPING
  const [swipingState, setSwipingState] = useState("NOT_SWIPING");
  const [initalSwipLocation, setInitialSwipeLocation] = useState();
  const swipeHandlers = useSwipeable({
    onSwiped: (eventData) => console.log("swiped", eventData),
    onSwipedLeft: (eventData) => console.log("left", eventData),
    onSwipedRight: (eventData) => console.log("right", eventData),
    onSwipedUp: (eventData) => console.log("up", eventData),
    onSwipedDown: (eventData) => console.log("down", eventData),
    onSwiping: (eventData) => console.log("swiping", eventData),
    ...swipeableConfig,
  });

  return (
    <div {...swipeHandlers}>
      <Grid
        tiles={tiles}
        renderTile={(tile, location) => (
          <Tile
            key={`${location.row}.${location.col}`}
            location={location}
            moveTile={(oldLocation, newLocation) => {
              const oldValue = getLocation(tiles, oldLocation);
              const newValue = getLocation(tiles, newLocation);
              const oneValueReplaced = updateMatrix(
                oldLocation,
                newValue,
                tiles
              );
              const bothValuesReplaced = updateMatrix(
                newLocation,
                oldValue,
                oneValueReplaced
              );

              setTiles(bothValuesReplaced);
            }}
            {...tile}
          />
        )}
      />
    </div>
  );
};

const root = document.getElementById("root");
ReactDOM.render(<App />, root);
