/*
Copyright 2018 Province of British Columbia

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at 

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Created by Patrick Simonian
*/
import React from 'react';
import PropTypes from 'prop-types';

import styled from '@emotion/styled';

import PhaseBanner from '../PhaseBanner/PhaseBanner';

const H2 = styled.h2`
  margin: 6px 3px 6px 0;
  padding: 0px 4px;
  text-decoration: none;
  font-size: 1.54912em;
`;

const Container = styled.div`
  display: flex;
  font-size: 1em;
`;

const AppLogo = ({ titleStyles, ...rest }) => (
  <Container {...rest}>
    <H2 {...titleStyles}>DevHub</H2>
    <PhaseBanner />
  </Container>
);

AppLogo.propTypes = {
  titleStyles: PropTypes.shape({
    style: PropTypes.object,
  }),
};

AppLogo.defaultProps = {
  titleStyles: {},
};

export default AppLogo;
