import Nav from "./Nav";

const About = () => {
  return (
    <>
    <Nav/>
      <div className="about-section"> 
        <h1 className="about-title">About</h1>
      </div>
      <div className="descp">
        <p className="descriptionp">
          MyMix allows you to create a fun 2000s-esqe CD mixtape based on your
          top tracks of the last month, 6 months, or the last year!
        </p>
      </div>
    </>
  );
};

export default About;
