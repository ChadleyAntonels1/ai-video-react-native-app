import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';

export const appwriteConfig ={
    endpoint:'https://cloud.appwrite.io/v1',
    platform: 'com.jsm.aora.videoapp',
    projectId: '66b5caa1003725331c1e',
    databaseId:'66b5cf64002c13053d31',
    userCollectionId: '66b5cf8b00359778a1f9',
    videoCollectionId: '66b5cfbd003b8fcb0ed4',
    storageID: '66b5d1c10012821dc7f9',
}
const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageID,
} = appwriteConfig;

// Init your React Native SDK
const client = new Client();


client
    .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
    .setProject(appwriteConfig.projectId) // Your project ID
    .setPlatform(appwriteConfig.platform) // Your application ID or bundle ID.
;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client)

 export const createUser = async (email, password, username) => {

    // Register User
    try{
        const newAccount = await account.create(
            ID.unique(),
            email, 
            password, 
            username
        )

        if(!newAccount) throw new Error;

        const avatarsURL = avatars.getInitials(username)

        await signIn(email, password)

        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarsURL
            }
        )

        return newUser;

    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export const signIn = async (email, password) => {
    try {
        const session = await account.createEmailPasswordSession(
            email, 
            password
            
        )
        return session;
    } catch (error) {
        throw new Error(error);
        
    }
}

export const getCurrentUser = async () => {
    try {

        const currentAccount = await account.get();

        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
                databaseId,
                userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentUser) throw Error;

        return currentUser.documents[0]
        
    } catch (error) {
        console.log(error)
    }
}

export const getAllPosts = async () =>{
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId
        )

        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}