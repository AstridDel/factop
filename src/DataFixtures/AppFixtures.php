<?php

namespace App\DataFixtures;

use Faker\Factory;
use App\Entity\User;
use App\Entity\Invoice;
use App\Entity\Customer;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AppFixtures extends Fixture
{
    //gestion securite MDP et documenter une variable:

    /**
     * L'encodeur de mots de passe
     *
     * @var UserPasswordEncoderInterface
     */

    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        //objet qui implement interface userpaswwordencoderinterface
        $this->encoder = $encoder;
    }

    public function load(ObjectManager $manager)
    {
        $faker = Factory::create('fr_FR'); //creer fixt en français

        //creation fixt faux users
        for ($u = 0; $u < 10; $u++) {
            $user = new User();
            $chrono = 1; //variable numero facture

            $hash = $this->encoder->encodePassword($user, "password");

            $user->setFirstName($faker->firstName())
                ->setLastName($faker->lastName)
                ->setEmail($faker->email)
                ->setPassword($hash);

            $manager->persist($user);

            //creation fixt client
            for ($c = 0; $c < mt_rand(5, 10); $c++) {
                $customer = new Customer(); // vient de l entity customer
                $customer->setFirstName($faker->firstName())
                    ->setLastName($faker->lastName)
                    ->setCompany($faker->company)
                    ->setEmail($faker->email)
                    ->setUser($user); //relier le client au user

                //faire persister son $customer dans le temps
                $manager->persist($customer);

                //creation fixt factures
                for ($i = 0; $i < mt_rand(3, 10); $i++) {
                    $invoice = new Invoice(); // vient de l entite invoice
                    $invoice->setAmount($faker->randomFloat(2, 250, 5000))
                        ->setSentAt($faker->dateTimeBetween('-6months'))
                        ->setStatus($faker->randomElement(['SENT', 'PAID', 'CANCELLED']))
                        ->setCustomer($customer)
                        ->setChrono($chrono);

                    //incrementer le num de facture
                    $chrono++;

                    // faire persister $invoice dans le temps
                    $manager->persist($invoice);
                }
            }
        }
        $manager->flush();
    }
}
