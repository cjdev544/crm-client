import { ApolloProvider } from '@apollo/client';
import client from 'config/apollo';

import Layout from 'components/AppLayout';

import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  );
}

export default MyApp;
