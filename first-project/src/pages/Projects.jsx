// Projects.js
import Card from '../components/Card';

const Projects = () => {
    return (
        <div>
            <h1 className="section-title">My Projects</h1>
            <Card
                title="Project One"
                description="A cool React project"
                link="https://github.com/shillat/first-project"
            />
            <Card
                title="Project Two"
                description="Another amazing project"
                link="https://github.com/shillat/second-project"
            />
        </div>
    );
};

export default Projects;
