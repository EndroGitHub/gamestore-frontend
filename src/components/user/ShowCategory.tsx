import { useNavigate } from "react-router-dom";
import "./ShowCategory.css";

const CategoryArray = [
  {
    category: "Action",
    image: "devilMayCry5.jpg",
    style: "red",
  },
  {
    category: "Adventure",
    image: "darkSouls2.jpg",
    style: "blue",
  },
  {
    category: "Free To Play",
    image: "dota2.jpg",
    style: "purple",
  },
  {
    category: "Open World",
    image: "eldenRing.jpg",
    style: "green",
  },
  {
    category: "Racing",
    image: "forzaHorizon4.jpg",
    style: "blue",
  },
  {
    category: "RPG",
    image: "darkSouls3.jpg",
    style: "green",
  },
  {
    category: "Shooting",
    image: "redDeadRedemption2.jpg",
    style: "purple",
  },
  {
    category: "Sports",
    image: "cricket22.jpg",
    style: "red",
  },
  {
    category: "Strategy",
    image: "pathOfExile.jpg",
    style: "purple",
  },
  {
    category: "All Games",
    image: "bgr1.jpg",
    style: "green",
  },
];

const ShowCategory = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="show-category-outer">
        <div className="show-category-inner">
          <div className="show-category-heading">
            <h1>CATEGORY</h1>
          </div>
          <div className="show-category-card-container">
            {CategoryArray.map((ins) => (
              <section
                onClick={() => {
                  navigate(`/category/${ins.category}`);
                }}
                key={ins.category}
                className="show-category-card"
              >
                <img src={`/images/${ins.image}`} alt="game image" />
                <div className={ins.style}>
                  <p>{ins.category.toLocaleUpperCase()}</p>
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ShowCategory;
