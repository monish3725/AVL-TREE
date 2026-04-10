#include<stdio.h>
#include<stdlib.h>
#include<string.h>
struct Book
{
    long long isbn;
    char title[100];
    char author[100];
    int height;
    struct Book *left, *right;
};
int max(int a, int b)
{
    if(a>b)
    {
        return a;
    }
    else
    {
        return b;
    }
}
int height(struct Book *node)
{
    if(node==NULL)
    {
        return 0;
    }
    return node->height;
}
int balanceFactor(struct Book *node)
{
    if(node==NULL)
    {
        return 0;
    }
    return height(node->left)-height(node->right);
}
struct Book* createNode(long long isbn, char title[], char author[])
{
    struct Book* node=(struct Book*)malloc(sizeof(struct Book));
    node->isbn=isbn;
    strcpy(node->title, title);
    strcpy(node->author,author);
    node->left=NULL;
    node->right=NULL;
    node->height=1;
    return node;
}
struct Book* rightRotate(struct Book *y)
{
    struct Book *x=y->left;
    struct Book *T2=x->right;
    x->right=y;
    y->left=T2;
    y->height=1+max(height(y->left), height(y->right));
    x->height=1+max(height(x->left), height(x->right));
    return x;
}
struct Book* leftRotate(struct Book *x)
{
    struct Book *y=x->right;
    struct Book *T2=y->left;
    y->left=x;
    x->right=T2;
    x->height=1+max(height(x->left), height(x->right));
    y->height=1+max(height(y->left), height(y->right));
    return y;
}
struct Book* insert(struct Book *root, long long isbn, char title[], char author[])
{
    if(root==NULL)
    {
        return createNode(isbn, title, author);
    }
    if (isbn < root->isbn)
    {
        root->left = insert(root->left, isbn, title, author);
    }
    else if(isbn>root->isbn)
    {
        root->right = insert(root->right, isbn, title, author);
    }
    else
    {
        strcpy(root->title, title);
        strcpy(root->author, author);
        return root;
    }
    root->height = 1 + max(height(root->left), height(root->right));
    int bf = balanceFactor(root);
    if(bf>1 && isbn < root->left->isbn)
    {
        return rightRotate(root);
    }
    if(bf<-1 && isbn > root->right->isbn)
    {
        return leftRotate(root);
    }
    if(bf>1 && isbn> root->left->isbn)
    {
        root->left = leftRotate(root->left);
        return rightRotate(root);
    }
    if (bf < -1 && isbn < root->right->isbn)
    {
        root->right = rightRotate(root->right);
        return leftRotate(root);
    }
    return root;
}
struct Book* search(struct Book *root, long long isbn)
{
    if (root == NULL || root->isbn == isbn)
    {
        return root;
    }
    if (isbn < root->isbn)
    {
        return search(root->left, isbn);
    }
    else
    {
        return search(root->right, isbn);
    }
}
struct Book* minValueNode(struct Book *node)
{
    struct Book *current = node;
    while (current->left != NULL)
    {
        current = current->left;
    }
    return current;
}
struct Book* deleteNode(struct Book *root, long long isbn)
{
    if (root == NULL)
    {
        return root;
    }
    if (isbn < root->isbn)
    {
        root->left = deleteNode(root->left, isbn);
    }
    else if (isbn > root->isbn)
    {
        root->right = deleteNode(root->right, isbn);
    }
    else
    {
        if (root->left == NULL || root->right == NULL)
        {
            struct Book *temp;
            if (root->left != NULL)
        {
            temp = root->left;
        }
        else
        {
            temp = root->right;
        }
        if (temp == NULL)
        {
            temp = root;
            root = NULL;
        }
        else
        {
            *root = *temp;
        }
        free(temp);
        }
        else
        {
            struct Book *temp = minValueNode(root->right);
            root->isbn = temp->isbn;
            strcpy(root->title, temp->title);
            strcpy(root->author, temp->author);
            root->right = deleteNode(root->right, temp->isbn);
        }
    }
    if(root==NULL)
    {
        return root;
    }
    root->height = 1 + max(height(root->left), height(root->right));
    int bf = balanceFactor(root);
    if (bf > 1 && balanceFactor(root->left) >= 0)
    {
        return rightRotate(root);
    }
    if (bf > 1 && balanceFactor(root->left) < 0)
    {
        root->left = leftRotate(root->left);
        return rightRotate(root);
    }
    if (bf < -1 && balanceFactor(root->right) <= 0)
    {
        return leftRotate(root);
    }
    if (bf < -1 && balanceFactor(root->right) > 0) 
    {
        root->right = rightRotate(root->right);
        return leftRotate(root);
    }
    return root;
}
void inorder(struct Book *root)
{
    if(root!=NULL)
    {
        inorder(root->left);
        printf("ISBN: %lld | Title: %s | Author: %s\n", root->isbn, root->title, root->author);
        inorder(root->right);
    }
}
int main()
{
    struct Book *root = NULL;
    int choice;
    long long isbn;
    char title[100], author[100];
    while (1)
    {
        printf("\n===== Library Menu =====\n");
        printf("1. Insert Book\n");
        printf("2. Search Book\n");
        printf("3. Delete Book\n");
        printf("4. Display Books (Sorted Order)\n");
        printf("5. Exit\n");
        printf("Enter your choice: ");
        scanf("%d", &choice);
        getchar();
        if(choice==1)
        {
            printf("Enter ISBN: ");
            scanf("%lld", &isbn);
            getchar();

            printf("Enter Title: ");
            fgets(title, sizeof(title), stdin);
            title[strcspn(title, "\n")] = '\0';

            printf("Enter Author: ");
            fgets(author, sizeof(author), stdin);
            author[strcspn(author, "\n")] = '\0';

            root = insert(root, isbn, title, author);
            printf("Book inserted successfully.\n");
        }
        else if(choice==2)
        {
            printf("Enter ISBN to search: ");
            scanf("%lld", &isbn);
            struct Book *found = search(root, isbn);
            if (found != NULL)
            {
                printf("Found: ISBN: %lld | Title: %s | Author: %s\n", found->isbn, found->title, found->author);
            }
            else
            {
                printf("Book not found.\n");
            }
        }
        else if(choice==3)
        {
            printf("Enter ISBN to delete: ");
            scanf("%lld", &isbn);
            root = deleteNode(root, isbn);
            printf("Book deleted successfully (if ISBN existed).\n");
        }
        else if(choice==4)
        {
            printf("\nBooks in sorted order:\n");
            inorder(root);
        }
        else if(choice==5)
        {
            break;
        }
        else
        {
            printf("Invalid choice.\n");
        }
    }
    return 0;
}