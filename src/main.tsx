import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './css/style.css';
import './css/notoSansKR.css';
import './css/satoshi.css';
import './css/simple-datatables.css';
import 'flatpickr/dist/flatpickr.min.css';
import { RecoilRoot } from 'recoil';
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AxiosClientProvider } from './AxiosClientProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000, // 30초
      refetchInterval: 30000, // 30초
      // 추가적으로 기본값을 설정할 수 있습니다.
    },
    mutations: {
      // mutations에 대한 기본값을 설정할 수도 있습니다.
    },
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <RecoilRoot>
    <Router>
      <ToastContainer />
      <QueryClientProvider client={queryClient}>
        <AxiosClientProvider />
        <App />
      </QueryClientProvider>
    </Router>
  </RecoilRoot>,
);
