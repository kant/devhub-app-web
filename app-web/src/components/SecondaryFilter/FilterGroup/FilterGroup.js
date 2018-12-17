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
import { connect } from 'react-redux';
import * as actions from '../../../store/actions/actions';
import styles from './FilterGroup.module.css';
import PropTypes from 'prop-types';
import {
  ARIA_LABEL_FILTER_RESOURCE,
  ARIA_LABEL_RESOURCES_MATCH_FILTER,
} from '../../../constants/ariaLabels';

export const FilterGroup = ({
  title,
  toggleFilter,
  filters,
  addFilter,
  removeFilter,
  filterNodes,
}) => (
  <div className={styles.FilterGroup}>
    <h2>{title}</h2>
    <ul>
      {filters.map(filter => (
        <li
          className={filter.active ? styles.active : ''}
          onClick={e => {
            e.preventDefault();
            console.log(filter.key);
            filter.active ? removeFilter(filter.key) : addFilter(filter.key);
            toggleFilter(filter.key);
            filterNodes();
          }}
          key={filter.key}
        >
          <button className={styles.link} aria-label={ARIA_LABEL_FILTER_RESOURCE}>
            {filter.text}
          </button>
          <span className={styles.FilterCount} aria-label={ARIA_LABEL_RESOURCES_MATCH_FILTER}>
            15
          </span>
        </li>
      ))}
    </ul>
  </div>
);

FilterGroup.propTypes = {
  title: PropTypes.string.isRequired,
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      filterBy: PropTypes.string.isRequired,
      active: PropTypes.bool.isRequired,
    }),
  ).isRequired,
  toggleFilter: PropTypes.func.isRequired,
  addFilter: PropTypes.func.isRequired,
  removeFilter: PropTypes.func.isRequired,
  filterNodes: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => {
  return {
    toggleFilter: key => dispatch(actions.toggleFilterGroup(key)),
    addFilter: key => dispatch(actions.addFilter(key)),
    removeFilter: key => dispatch(actions.removeFilter(key)),
    filterNodes: () => dispatch(actions.filterSiphonNodesByFilterList()),
  };
};

export default connect(
  null,
  mapDispatchToProps,
)(FilterGroup);
