import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Give lazy-loaded routes a bit more time in CI
configure({ asyncUtilTimeout: 4000 });
