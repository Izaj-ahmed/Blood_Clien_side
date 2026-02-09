import React from 'react';
import Bannar from './Bannar/Bannar';
import Section1 from './Section/Section1';
import Brands from './Brands/Brands';
import Reviwes from './Reviews/Reviwes';

const Home = () => {
    return (
        <div>
            <Bannar></Bannar>
            <Section1></Section1>
            <Brands></Brands>
            <Reviwes></Reviwes>
        </div>
    );
};

export default Home;