import axios from 'axios';
import React, { useState, useRef, useCallback } from 'react';
import { useQuery, useInfiniteQuery } from 'react-query';

const Todo = () => {

    const scrollContainerRef = useRef(null);
    const [page, setPage] = useState(1);

    const fetchData = async ({ pageParams = 2 }) => {
        const response = await axios.get(`https://picsum.photos/v2/list?page=${pageParams}`);
        return response.data;
    };

    // const { data, isLoading, isError, error } = useQuery(['posts', page], () => fetchData(page))
    const { data, isLoading, isError, error } = useInfiniteQuery(['posts'], fetchData, {
        getNextPageParam: (_lastPage, pages) => {

        }
    })
    // Attach a scroll event listener to the scroll container.

    const handleScroll = useCallback(() => {
        if (data && data.length === 0) {
            if (
                scrollContainerRef.current &&
                scrollContainerRef.current.scrollHeight -
                (scrollContainerRef.current.scrollTop + scrollContainerRef.current.clientHeight) <
                200 // Adjust this value as needed for your scroll threshold
            ) {
                // Fetch the next page when the user scrolls near the bottom.
                setPage((prevPage) => prevPage + 1);
            }
        } else {
            console.log("empty data: ", page, data)
        }
    }, []);


    return (
        <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className='gallery-container'
        >
            {/* Render your data */}
            {console.log(data?.pages)}
            <div className='scroll-container'>
                {data?.pages.map((posts, index) => (
                    <div key={index} className='page'>
                        {posts.map((post, i) => {
                            if(post.url){
                                {console.log("-> ", post.url)}
                                return (
                                    <div key={i} className='image-container'>
                                        <img src={post.url} alt={post.author} />
                                        {post.author}
                                    </div>
                                )
                            }else{
                                {console.log("else : ", post.url)}
                                return (
                                    <div key={i} className='image-container'>
                                        <p>Image not found</p>
                                        {post.author}
                                    </div>
                                )
                            }
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
