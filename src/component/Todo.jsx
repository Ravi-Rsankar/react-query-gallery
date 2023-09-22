import axios from 'axios';
import React, { useState, useRef, useCallback } from 'react';
import { useQuery, useInfiniteQuery } from 'react-query';

const Todo = () => {

    const scrollContainerRef = useRef(null);
    const [page, setPage] = useState(1);

    const fetchData = async ({pageParams = 1}) => {
        const response = await axios.get(`https://picsum.photos/v2/list?page=${pageParams}`);
        return response.data;
    };

    // const { data, isLoading, isError, error } = useQuery(['posts', page], () => fetchData(page))
    const { data, isLoading, isError, error } = useInfiniteQuery(['posts'], fetchData , {
        getNextPageParam: (_lastPage, pages) => {

        }
    })
    // Attach a scroll event listener to the scroll container.

    const handleScroll = useCallback(() => {
        if(data && data.length === 0){
            if (
                scrollContainerRef.current &&
                scrollContainerRef.current.scrollHeight -
                (scrollContainerRef.current.scrollTop + scrollContainerRef.current.clientHeight) <
                200 // Adjust this value as needed for your scroll threshold
            ) {
                // Fetch the next page when the user scrolls near the bottom.
                setPage((prevPage) => prevPage + 1);
            }
        }else{
            console.log("empty data: ",page,  data)
        }
    }, []);


    return (
        <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            style={{
                height: '400px', // Set the height of the scrollable container as needed
                overflowY: 'auto',
            }}
        >
            {/* Render your data */}
            <div className="">
                {data?.pages.map((posts, index) => (
                    <div key={index}>
                        {posts.map((post, i) => {
                            return <div key={i}>
                                {post.author}
                            </div>
                        })}
                    </div>
                ))}
            </div>
            {/* Add a loading indicator while fetching the next page */}
            {isLoading && <div>Loading more...</div>}

            {/* Display an error message if there's an error */}
            {isError && <div>Error loading data</div>}

        </div>
    )
}

export default Todo
