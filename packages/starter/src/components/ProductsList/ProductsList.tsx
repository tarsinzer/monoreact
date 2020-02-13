import React from 'react';
import { Box, Grommet, grommet, List } from 'grommet';

import { productsProgress } from './ProductsList.helpers';
import styles from './ProductsList.scss';

export const ProductsList = () => (
  <Grommet className={styles.container} theme={grommet}>
    <Box align='center' className={styles.list} pad='medium'>
      <List
        data={productsProgress}
        primaryKey={React.useCallback(item => item.name, [])}
        secondaryKey={React.useCallback(item => `${item.percent}%`, [])}
      />
    </Box>
  </Grommet>
);
