import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { useCreatPostMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/ceateUrqlClient";
import { useIsAuth } from "../utils/useIsAuth";

const CreatePost: React.FC<{}> = ({}) => {
  const router = useRouter();
  useIsAuth();
  const [, createPost] = useCreatPostMutation();
    return (
      <Layout variant="small">
        <Formik
          initialValues={{ title: "", text: "" }}
          onSubmit={async (values) => {
            const {error} = await createPost({input: values});
            if(!error){
              router.push('/');
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField
                name="title"
                label="Title"
                placeholder="title"
              ></InputField>
  
              <Box mt={4}>
                <InputField
                  textarea
                  name="text"
                  label="Body"
                  placeholder="text..."
                ></InputField>
              </Box>
  
              <Button
                type="submit"
                isLoading={isSubmitting}
                mt={4}
                textColor="white"
                backgroundColor="teal"
              >
                {" "}
                create post{" "}
              </Button>
            </Form>
          )}
        </Formik>
      </Layout>
    );
  };

  export default withUrqlClient(createUrqlClient)(CreatePost);