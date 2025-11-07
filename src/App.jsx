import React, { useEffect, useState } from "react";
import LinkedInJobPoster from "@/components/LinkedInJobPoster";

function App() {
    const [jd, setJd] = useState(null);

    useEffect(() => {
        fetch("https://your-ec2-api.com/api/get-latest-jd")
            .then(res => res.json())
            .then(data => setJd({
                title: data.title,
                description: data.description,
                applyLink: "https://yourplatform.com/apply"
            }));
    }, []);

    return (
        <div className="p-6">
            <LinkedInJobPoster jobData={jd} />
        </div>
    );
}

export default App;
