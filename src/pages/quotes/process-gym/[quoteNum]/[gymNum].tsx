import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector, processGyms } from 'store';
import { PropagateLoader } from 'react-spinners';

const ProcessGymPage: NextPage = (pageProps) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { quoteNum, gymNum } = router.query;

  useEffect(() => {
    let mounted = true;

    const processGym = async () => {
      let resp = await dispatch(processGyms(quoteNum, gymNum));
      if (resp) {
        console.log(resp);
        setLoading(false);
        router.push(`/quotes/info/${quoteNum}`);
      }
    };

    if (mounted && quoteNum && gymNum) {
      try {
        processGym();
      } catch (e) {
        console.log(e);
      }
    }

    return () => {
      mounted = false;
    };
  }, [quoteNum, gymNum]);
  return (
    <>
      {loading ? (
        <div className="relative flex flex-col justify-center w-full h-100 align-center">
          <div className="relative flex flex-row justify-center w-full">
            <span className="text-center">Loading...</span>
          </div>
          <div className="relative flex flex-row justify-center w-full">
            <PropagateLoader size={15} loading={loading} color={`blue`} />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ProcessGymPage;
