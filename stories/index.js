import React from 'react';
import { storiesOf } from '@storybook/react';
import { doc } from 'storybook-readme';

import App from 'stories/App';
import { WindRose } from 'src';

import Readme from '../README.md';
import data from './data.json';

storiesOf('Documentation', module)
  .add('Readme', doc(Readme));

storiesOf('Core', module)
  .add('WindRose', () => (
    <App>
      <WindRose data={data.data} columns={data.columns} />
    </App>
  ));


require('./packages');
